/** The story of Carlos's space farm. A chapter plays when the rocket lands after `at` launches. */

export type Speaker = "carlos" | "radio" | "queen" | "narrator";

export interface Line {
  who: Speaker;
  text: string;
  /** which Carlos picture to show (carlos lines only) */
  pose?: "sitting" | "astronaut" | "oops" | "gardener" | "desk";
}

export interface Chapter {
  at: number;
  title: string;
  /** shown in the journal once the chapter has played */
  summary: string;
  lines: Line[];
}

export const SPEAKER_NAME: Record<Speaker, string> = {
  carlos: "Carlos",
  radio: "Regee, on the radio",
  queen: "The slug queen",
  narrator: "",
};

export const CHAPTERS: Chapter[] = [
  {
    at: 0,
    title: "Crash landing",
    summary:
      "Carlos lands on a scrap of land in space. Home needs fresh food, and the rocket knows one trip.",
    lines: [
      {
        who: "narrator",
        text: "A cargo rocket drifts off course and sets down on a scrap of land the size of a backyard.",
      },
      { who: "carlos", pose: "oops", text: "Well. This is not the vet." },
      { who: "radio", text: "Carlos? Carlos, do you copy? It's me." },
      {
        who: "radio",
        text: "The rocket still flies, but it only knows one trip: home and back. And home is running low on fresh food.",
      },
      {
        who: "carlos",
        pose: "astronaut",
        text: "So I grow things and it carries them. Fine. I've knocked over enough pots to know how they work.",
      },
      {
        who: "radio",
        text: "Start small. Three turnips. Take your time with this one.",
      },
    ],
  },
  {
    at: 1,
    title: "Something in the dark",
    summary:
      "The first delivery arrives. Something with one eye is watching the field.",
    lines: [
      { who: "carlos", pose: "sitting", text: "Did the turnips make it?" },
      {
        who: "radio",
        text: "Every one. People queued for them. I put carrot seeds in the hold for you.",
      },
      {
        who: "radio",
        text: "One thing. The scanner shows movement near your field.",
      },
      {
        who: "carlos",
        pose: "oops",
        text: "It has one eye, and it is looking at my turnips.",
      },
    ],
  },
  {
    at: 2,
    title: "Lights in the sky",
    summary:
      "Orders now come with a launch window. Saucers start taking vegetables after dark.",
    lines: [
      {
        who: "radio",
        text: "From here the rocket can't wait for you. It has a launch window, so every order has a clock.",
      },
      { who: "carlos", pose: "sitting", text: "And the saucers?" },
      { who: "radio", text: "...What saucers?" },
      {
        who: "carlos",
        pose: "astronaut",
        text: "The ones lifting vegetables after dark. I stood under one. It left. I think they're shy.",
      },
    ],
  },
  {
    at: 3,
    title: "Falling stars",
    summary:
      "The island passes through a meteor stream. What falls leaves something behind.",
    lines: [
      {
        who: "radio",
        text: "Tonight you pass through a meteor stream. Watch for orange rings on the ground.",
      },
      { who: "carlos", pose: "sitting", text: "And then?" },
      { who: "radio", text: "Then don't stand in them." },
      {
        who: "narrator",
        text: "Whatever falls from the sky leaves a shard of light behind. Carlos starts collecting them. He isn't sure why yet.",
      },
    ],
  },
  {
    at: 4,
    title: "The queen",
    summary:
      "The slugs stop coming one by one. Something larger is leading them.",
    lines: [
      {
        who: "narrator",
        text: "The slugs have stopped arriving one at a time. Something larger is leading them.",
      },
      { who: "queen", text: "..." },
      {
        who: "carlos",
        pose: "oops",
        text: "She's wearing a crown. I respect that. She still can't have the rice.",
      },
    ],
  },
  {
    at: 6,
    title: "Why they come",
    summary:
      "The slugs' own moon dried out years ago. They aren't raiders. They're hungry.",
    lines: [
      {
        who: "radio",
        text: "I looked into your slugs. Their moon dried out years ago. Nothing grows there now.",
      },
      {
        who: "carlos",
        pose: "sitting",
        text: "So they aren't raiders. They're hungry.",
      },
      { who: "radio", text: "It doesn't change the order sheet." },
      {
        who: "carlos",
        pose: "gardener",
        text: "No. But it changes how hard I swat.",
      },
    ],
  },
  {
    at: 8,
    title: "The truce",
    summary:
      "The queen returns. Carlos leaves her a row at the edge of the field. Fewer slugs raid the farm now.",
    lines: [
      {
        who: "narrator",
        text: "The queen comes back. This time Carlos leaves a row unharvested at the edge of the field.",
      },
      { who: "queen", text: "..." },
      {
        who: "narrator",
        text: "She eats. She looks at him for a long moment with her one enormous eye. Then she goes.",
      },
      {
        who: "carlos",
        pose: "gardener",
        text: "I think we have an arrangement.",
      },
    ],
  },
  {
    at: 10,
    title: "The long way home",
    summary:
      "Two more runs and the rocket will have fuel for a different kind of trip.",
    lines: [
      {
        who: "radio",
        text: "Two more runs and the rocket will have earned enough fuel for a different trip.",
      },
      { who: "carlos", pose: "sitting", text: "Different how?" },
      {
        who: "radio",
        text: "One that carries a passenger. I've been building something. A porch. A rocking chair.",
      },
      { who: "carlos", pose: "desk", text: "And a dog. You said a dog." },
      { who: "radio", text: "I said maybe a dog." },
    ],
  },
  {
    at: 12,
    title: "A cat and a dog",
    summary:
      "The twelfth rocket comes back heavier than it left. Home turns out to be wherever the farm is.",
    lines: [
      {
        who: "narrator",
        text: "The twelfth rocket comes back heavier than it left.",
      },
      {
        who: "narrator",
        text: "A hatch opens. Something with four legs and no sense of personal space tumbles out.",
      },
      { who: "carlos", pose: "oops", text: "You sent the dog here." },
      {
        who: "radio",
        text: "Turns out home is wherever the farm is. Keep growing, Carlos. We're coming to you.",
      },
      {
        who: "narrator",
        text: "The end. The farm stays open, and the dog will fetch whatever falls. Keep launching for as long as you like.",
      },
    ],
  },
];

/** from this chapter on, the slugs raid less often and the queen stays away */
export const TRUCE = 7;
