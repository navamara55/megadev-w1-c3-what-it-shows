<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { groupByProblem, type Problem } from '#lib/kb/problems';

  // issues: where each problem is filed now, problem → URL.
  let { ticket, issues = {} }: { ticket: number; issues?: Partial<Record<Problem, string>> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
  const rows = (reports as Report[]).length;
  const issueNo = (url: string) => '#' + url.split('/').pop();
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>filed as</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if issues[g.problem]}<a href={issues[g.problem]}>{issueNo(issues[g.problem] ?? '')}</a>{:else}not filed{/if}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr><td>total</td><td>{groups.reduce((n, g) => n + g.reports.length, 0)}</td><td colspan="3"></td></tr>
  </tfoot>
</table>

<p class="note">The export has {rows} rows; {rows - uniqueById(reports as Report[]).length} repeat a report id and count once.</p>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  tfoot td { font-weight: 600; }
</style>
