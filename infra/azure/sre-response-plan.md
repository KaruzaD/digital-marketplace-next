# SRE agent response plan: exception incidents

Configured by hand in the Azure SRE agent (portal: the agent's **Incident response plans**), because
the agent's plans are not deployable from this repository. The alert it handles is
`dmdev-backend-exceptions` ([alerts.bicep](modules/alerts.bicep)): more than 5 `exceptions` from
`dmdev-backend` in 5 minutes. The agent receives Azure Monitor alerts through its incident platform
connection, so no action group is needed.

## Plan

- **Name:** Backend exception incident
- **Trigger:** Azure Monitor alert, alert rule name `dmdev-backend-exceptions` (severity 2)
- **Autonomy:** Review mode (the agent has read-only Azure roles and proposes, never changes, anything)
- **Custom instructions:**

```text
Investigate the exceptions behind this alert, then open a GitHub issue in
KaruzaD/digital-marketplace-next. Do not change any Azure resource and do not attempt a fix.

1. Query Application Insights `exceptions` for cloud_RoleName == "dmdev-backend" over the alert's
   window. Take the most frequent exception type and message.
2. Find the failing route: join to `requests` on operation_Id and report the method, URL path and
   result code with the most failures.
3. Find the suspect commit. The deployed image tag is the first 12 characters of the commit SHA;
   read it from the running container app's image. Compare it with the previous deployed tag and
   name the commit in that range that touched the code in the stack trace.
4. Create the issue with the label `sre-incident` and this body:
   - Summary: one sentence.
   - Stack trace: the full trace in a code block.
   - Failing route: method and path, and the count of failures.
   - Time window: start and end in UTC.
   - Suspect commit: SHA, author, message, and its diff in a ```diff block.
   - Expected behaviour: what the route should answer.
5. Do not mention `scripts/smoke-exceptions.sh` as something to change; it is a test tool.
```

## Hand-off

The `sre-incident` label triggers `.github/workflows/assign-copilot.yml`, which assigns the issue to
`@copilot` using the `COPILOT_ASSIGN_TOKEN` secret (a fine-grained PAT or GitHub App token with
Issues: read/write on this repository). The Copilot cloud agent then opens a pull request that fixes
the root cause and adds a regression test, as `.github/copilot-instructions.md` requires.
