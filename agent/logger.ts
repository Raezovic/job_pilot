import { AgentLogLevel, AgentRunStatus } from "@/types";

export interface LogStepParams {
  runId?: string | null;
  userId: string;
  message: string;
  level: AgentLogLevel;
  jobId?: string | null;
}

/**
 * Creates a new agent_runs entry in the backend database.
 */
export async function startAgentRun(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insforgeClient: any,
  userId: string,
  jobTitleSearched?: string,
  locationSearched?: string
): Promise<string | null> {
  try {
    const { data, error } = await insforgeClient
      .from("agent_runs")
      .insert([
        {
          user_id: userId,
          status: "running",
          job_title_searched: jobTitleSearched || null,
          location_searched: locationSearched || null,
          jobs_found: 0,
          started_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create agent run:", error);
      return null;
    }
    return data?.id || null;
  } catch (err) {
    console.error("Error starting agent run:", err);
    return null;
  }
}

/**
 * Updates an agent_runs entry when completed or failed.
 */
export async function finishAgentRun(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insforgeClient: any,
  runId: string,
  status: AgentRunStatus,
  jobsFound: number = 0
): Promise<void> {
  try {
    const { error } = await insforgeClient
      .from("agent_runs")
      .update({
        status,
        jobs_found: jobsFound,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    if (error) {
      console.error(`Failed to update agent run ${runId}:`, error);
    }
  } catch (err) {
    console.error("Error finishing agent run:", err);
  }
}

/**
 * Creates a new entry in agent_logs to provide a full paper trail of agent interactions.
 */
export async function logAgentStep(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insforgeClient: any,
  params: LogStepParams
): Promise<void> {
  const { runId, userId, message, level, jobId } = params;
  try {
    const { error } = await insforgeClient.from("agent_logs").insert([
      {
        run_id: runId || null,
        user_id: userId,
        message,
        level,
        job_id: jobId || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Failed to insert agent log:", error);
    }
  } catch (err) {
    console.error("Error inserting agent log step:", err);
  }
}
