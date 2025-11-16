import React, { useRef, useState } from "react";

interface BeatData {
  time: number;
  type: "strong" | "weak";
  intensity: number;
  frequencyBand: "low" | "mid" | "high";
  energyDelta: number;
  spectralFlux: number;
  spectralCentroid: number;
}

const BeatProcessor: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [beats, setBeats] = useState<BeatData[]>([]);
  const beatsRef = useRef<BeatData[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const prevMagsRef = useRef<Float32Array | null>(null);
  const rmsHistoryRef = useRef<number[]>([]);
  const lastBeatTimeRef = useRef(0);

  const params = {
    fftSize: 2048,
    rmsHistoryLength: 43,
    rmsThreshold: 1.5,
    fluxThreshold: 0.02,
    strongFluxThreshold: 0.04,
    minBeatGap: 0.25,
    sampleRate: 44100,
  };

  const computeRms = (timeData: Float32Array) => {
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) sum += timeData[i] ** 2;
    return Math.sqrt(sum / timeData.length);
  };

  const dbToMagnitude = (db: number) => {
    if (!isFinite(db)) return 0;
    return Math.pow(10, db / 20);
  };

  const spectralCentroid = (
    mags: Float32Array,
    fftSize: number,
    sampleRate: number
  ) => {
    let num = 0;
    let den = 0;
    const binFreq = sampleRate / fftSize;

    for (let i = 0; i < mags.length; i++) {
      num += i * binFreq * mags[i];
      den += mags[i];
    }
    return den <= 0 ? 0 : num / den;
  };

  const spectralFlux = (mags: Float32Array, prev: Float32Array | null) => {
    if (!prev) return 0;
    let flux = 0;
    for (let i = 0; i < mags.length; i++) {
      const diff = mags[i] - prev[i];
      if (diff > 0) flux += diff;
    }
    return flux / mags.length;
  };

  const centroidToBand = (centroid: number): "low" | "mid" | "high" => {
    if (centroid < 250) return "low";
    if (centroid > 2000) return "high";
    return "mid";
  };

  const processFrame = () => {
    const analyser = analyserRef.current;
    const audio = audioRef.current;
    if (!analyser || !audio) return;

    const fftSize = analyser.fftSize;

    const timeData = new Float32Array(fftSize);
    analyser.getFloatTimeDomainData(timeData);

    const rmsVal = computeRms(timeData);
    const hist = rmsHistoryRef.current;

    hist.push(rmsVal);
    if (hist.length > params.rmsHistoryLength) hist.shift();

    const avgRms =
      hist.reduce((a, b) => a + b, 0) / Math.max(hist.length, 1);

    const freqDataDb = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(freqDataDb);

    const mags = new Float32Array(freqDataDb.length);
    for (let i = 0; i < freqDataDb.length; i++)
      mags[i] = dbToMagnitude(freqDataDb[i]);

    const centroid = spectralCentroid(
      mags,
      fftSize,
      params.sampleRate
    );

    const flux = spectralFlux(mags, prevMagsRef.current);
    prevMagsRef.current = mags;

    const now = audio.currentTime;
    const timeSinceLastBeat = now - lastBeatTimeRef.current;

    const isRmsBeat = rmsVal > avgRms * params.rmsThreshold;
    const isFluxBeat = flux > params.fluxThreshold;

    if ((isRmsBeat || isFluxBeat) && timeSinceLastBeat > params.minBeatGap) {
      const isStrong =
        flux > params.strongFluxThreshold ||
        rmsVal > avgRms * (params.rmsThreshold + 0.3);

      const beat: BeatData = {
        time: Number(now.toFixed(3)),
        type: isStrong ? "strong" : "weak",
        intensity: Number(
          Math.min(
            1,
            Math.max(
              0,
              (rmsVal - avgRms * 1.0) / (avgRms * 2) + 0.5
            )
          ).toFixed(3)
        ),
        frequencyBand: centroidToBand(centroid),
        energyDelta: Number((rmsVal - avgRms).toFixed(4)),
        spectralFlux: Number(flux.toFixed(6)),
        spectralCentroid: Number(centroid.toFixed(1)),
      };

      beatsRef.current.push(beat);
      setBeats([...beatsRef.current]);

      lastBeatTimeRef.current = now;
    }

    rafRef.current = requestAnimationFrame(processFrame);
  };

  const startAnalysis = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      params.sampleRate = ctx.sampleRate;
    }

    const audioCtx = audioContextRef.current;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = params.fftSize;
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    beatsRef.current = [];
    setBeats([]);

    await audio.play().catch(async () => {
      await audioCtx.resume();
      await audio.play();
    });

    rafRef.current = requestAnimationFrame(processFrame);

    audio.onended = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      exportBeatsJson();
    };
  };

  const exportBeatsJson = (filename = "beats.json") => {
    const blob = new Blob([JSON.stringify(beatsRef.current, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const stopAnalysis = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    analyserRef.current?.disconnect();
    audioContextRef.current?.close();
  };

  return (
    <div style={{ padding: 12 }}>
      <h3>Beat Processor</h3>

      <audio
        ref={audioRef}
        controls
        src="/src/assets/audio/song3.mp3"
        style={{ width: "100%" }}
      />

      <div style={{ margin: 8 }}>
        <button onClick={startAnalysis}>Analyse</button>
        <button onClick={() => exportBeatsJson()} style={{ marginLeft: 8 }}>
          Export JSON
        </button>
        <button onClick={stopAnalysis} style={{ marginLeft: 8 }}>
          Stop
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Detected Beats ({beats.length})</h4>
        <pre
          style={{
            maxHeight: 240,
            overflow: "auto",
            background: "#111",
            color: "#0f0",
            padding: 12,
          }}
        >
          {JSON.stringify(beats, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default BeatProcessor;
