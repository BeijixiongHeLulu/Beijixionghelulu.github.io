// Shared scientific labels for the graphical abstract and its narrow presentation.
export const actaFigure = {
  measureTitle: "Measure honest reporting",
  task: [
    {
      title: "Predict",
      detail: "Heads or tails",
    },
    {
      title: "Observe",
      detail: "Coin outcome",
    },
    {
      title: "Report",
      detail: "Correct or incorrect",
    },
  ],
  actualInput: "Recorded prediction + outcome",
  actualLabel: "Actual correctness",
  reportedInput: "Participant’s report",
  reportedLabel: "Reported correctness",
  comparison: "Compare to identify honest reporting",
  reward: "Claiming ‘correct’ earns more task tokens.",
  conditionsTitle: "Vary supervision and incentives",
  monitoring: [
    {
      title: "1 · Visible monitoring",
      detail: "Cue present or absent",
    },
    {
      title: "2 · Possible monitoring",
      detail: "No visible cue",
    },
  ],
  monitoringContext: "Same participants, sequential tasks",
  interventions: [
    {
      title: "3a · Monetary reward",
      phases: ["Baseline", "Added reward", "Withdrawal"],
    },
    {
      title: "3b · Moral feedback",
      phases: ["Baseline", "Added feedback", "Withdrawal"],
    },
  ],
  interventionContext: "Separate groups",
  traits: "Measured personality traits (SD3)",
  findingsTitle: "Compare behavior",
  finding:
    "Honest reporting was higher when monitoring was visible in this task.",
  canonicalDescription:
    "Participants predicted a heads-or-tails outcome, observed the outcome, and reported whether their prediction was correct. The recorded prediction and outcome determined actual correctness; comparing it with reported correctness identified honest or dishonest reports. Experiments 1 and 2 examined visible and uncertain monitoring sequentially in the same participants. Separate groups in Experiments 3a and 3b experienced monetary rewards or moral feedback across baseline, added-intervention and withdrawal phases. Personality traits were measured with SD3, not assigned as experimental conditions. Honest reporting was higher when monitoring was visible in this task.",
} as const;
