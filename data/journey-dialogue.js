// Fictional threat-hunting narration. Reviewed through pull requests.
const journeyDialogue = {
  "TH-001": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-002": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.\n\nThis investigation follows an evidence-led approach.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-003": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario. This investigation follows an evidence-led approach.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-004": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-005": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-006": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-007": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-008": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-009": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  },
  "TH-010": {
    "positive": [
      "My Logic App runs the scheduled hunts and writes the totals to the register. For {hunt}, it reports {matches} matches in this fictional scenario.",
      "In my scheduled master query, the final stages reduce the events to a count. To investigate, I remove the final summarize and QueryName stages and return event-level fields.",
      "Now I can inspect the underlying activity. The sample rows below are fictional, with different accounts, assets and outcomes. Select a row to inspect its details.",
      "Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. {check}",
      "{cross}",
      "{question} I use the surrounding evidence to decide what to do next.",
      "I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining."
    ],
    "zero": [
      "My scheduled {hunt} hunt looks for {focus}. This simulated run returned zero matches. I would first check whether that makes sense for this type of activity.",
      "I open the KQL for {hunt} and work backwards from the final count. In this case I am particularly interested in {filters}.",
      "Now I would check {source} for recent activity. I would start broadly, then reapply the hunt filters to see whether a condition or threshold excluded the events.",
      "I would record the outcome against {hunt}, including any filter or ingestion checks still outstanding. I would not mark the detection as validated just because the query returned nothing."
    ]
  }
};
