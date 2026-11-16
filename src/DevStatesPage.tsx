import { DEV_STATES } from "./devStates";

/** Dev only (`/dev/states`): every approved picture's state, a link to it, and the picture it is checked against. */
export function DevStatesPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Approved states</h1>
      <table>
        <thead>
          <tr>
            <th align="left">Page</th>
            <th align="left">State</th>
            <th align="left">Opens</th>
            <th align="left">Picture</th>
          </tr>
        </thead>
        <tbody>
          {DEV_STATES.map(({ page, state, url, picture }) => (
            <tr key={`${page}/${state}`}>
              <td>{page}</td>
              <td>{state}</td>
              <td>
                <a href={url}>{url}</a>
              </td>
              <td>{picture}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
