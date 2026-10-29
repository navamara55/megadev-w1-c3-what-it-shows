<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Cause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // issues: where each cause is filed now, cause → URL.
  let { ticket, issues = {} }: { ticket: number; issues?: Partial<Record<Cause, string>> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const rows = (reports as Report[]).length;
  const issueNo = (url: string) => '#' + url.split('/').pop();
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>filed as</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const url = g.cause === 'unplaced' ? undefined : issues[g.cause]}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if url}<a href={url}>{issueNo(url)}</a>{:else}not filed{/if}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr><td>total</td><td>{groups.reduce((n, g) => n + g.reports.length, 0)}</td><td colspan="3"></td></tr>
  </tfoot>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">{moved} of the <code>{g.cause}</code> reports read as a one-day move; counted under <code>{g.cause}</code> by tenant and channel.</p>
  {/if}
{/each}
<p class="note">The export has {rows} rows; {rows - uniqueById(reports as Report[]).length} repeat a report id and count once.</p>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  tfoot td { font-weight: 600; }
</style>
