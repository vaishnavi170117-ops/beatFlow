import fs from "fs";

// Load raw feature data
const raw = JSON.parse(
  fs.readFileSync("public/beats/beats2.json", "utf8")
);

function pickMove(e) {
  const score = {
    kickstep: 0,
    runningman: 0,
    locking: 0,
    wave: 0,
    snake: 0,
    sideToSide: 0,
    step: 0,
  };

  // ------------------------------------------------------------------
  // 1) TYPE (strong/weak)
  // ------------------------------------------------------------------
  if (e.type === "strong") {
    score.kickstep += 3;
    score.runningman += 2;
    score.locking += 4;        // punchy
  }

  if (e.type === "weak") {
    score.wave += 3;
    score.snake += 2;
    score.sideToSide += 1;
  }

  // ------------------------------------------------------------------
  // 2) Spectral FLUX (sudden change)
  // ------------------------------------------------------------------
  if (e.spectralFlux > 0.00012) score.locking += 3;
  if (e.spectralFlux > 0.00018) score.kickstep += 2; // harder hits

  // ------------------------------------------------------------------
  // 3) Intensity (overall energy)
  // ------------------------------------------------------------------
  if (e.intensity > 0.9) {
    score.kickstep += 3;
    score.runningman += 3;
  }
  if (e.intensity > 0.82) {
    score.snake += 1;
    score.wave += 1;
  }
  if (e.intensity < 0.78) {
    score.wave += 2;
    score.step += 1;
  }

  // ------------------------------------------------------------------
  // 4) Frequency band
  // ------------------------------------------------------------------
  if (e.frequencyBand === "high") {
    score.locking += 2;       // bright punchy
    score.wave += 1;          // airy smooth
  }
  if (e.frequencyBand === "mid") {
    score.runningman += 2;
    score.snake += 2;         // body groove
  }
  if (e.frequencyBand === "low") {
    score.kickstep += 1;      // grounding
    score.sideToSide += 2;
  }

  // ------------------------------------------------------------------
  // 5) Spectral centroid (brightness)
  // ------------------------------------------------------------------
  if (e.spectralCentroid > 3300) {
    score.locking += 2;
    score.wave += 2;
  }
  if (e.spectralCentroid < 2000) {
    score.kickstep += 2;
    score.snake += 1;
  }

  // ------------------------------------------------------------------
  // 6) Energy delta (sudden loudness jump)
  // ------------------------------------------------------------------
  if (e.energyDelta > 0.12) score.kickstep += 3;
  if (e.energyDelta > 0.08) score.runningman += 2;
  if (e.energyDelta < 0.03) score.wave += 1;

  // ------------------------------------------------------------------
  // Pick highest scoring move
  // ------------------------------------------------------------------
  let bestMove = "step";
  let bestScore = -999;

  for (const m in score) {
    if (score[m] > bestScore) {
      bestScore = score[m];
      bestMove = m;
    }
  }

  return bestMove;
}

// ---------------------------------------------------------------
// Generate choreo file
// ---------------------------------------------------------------
const output = raw.map(e => ({
  time: e.time,
  move: pickMove(e)
}));

fs.writeFileSync(
  "src/assets/data/choreo2.json",
  JSON.stringify(output, null, 2)
);

console.log("🔥 choreo.json generated with hip-hop scoring engine!");
