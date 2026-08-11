/*
 * Tool Cylinder — browser validation script.
 *
 * Run against the live app (dev or prod build):
 *   1. Open the site and scroll to #toolkit, or
 *   2. Paste this whole file into the browser console, or drive it via any
 *      CDP/automation harness, then:  await window.testToolCylinder()
 *
 * Asserts that clicking each of the 6 cartridges rotates the cylinder and
 * updates the Detail Card title to the matching module, and that SPIN
 * disables input while spinning and lands on a valid module.
 */
window.testToolCylinder = async function testToolCylinder() {
  const EXPECTED = [
    'ERP Operations',
    'SaaS Architecture',
    'IVS Valuations',
    'B2B Prospecting',
    'CRM Pipelines',
    'API Integrations'
  ];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const results = [];

  document.getElementById('toolkit')?.scrollIntoView({ block: 'center' });
  await sleep(400);

  for (let i = 0; i < 6; i++) {
    const btn = document.querySelector(`[data-testid="cartridge-${i}"]`);
    if (!btn) {
      results.push({ slot: i, pass: false, error: 'cartridge button not found' });
      continue;
    }
    btn.click();
    await sleep(1000); // allow rotation + card swap animation
    const title = document.querySelector('[data-testid="detail-title"]')?.textContent?.trim();
    results.push({ slot: i, expected: EXPECTED[i], got: title, pass: title === EXPECTED[i] });
  }

  // SPIN: must disable the button during the spin and land on a valid module
  const spinBtn = document.querySelector('[data-testid="spin-button"]');
  spinBtn.click();
  await sleep(300);
  const disabledDuringSpin = spinBtn.disabled === true;
  await sleep(2800);
  const landedTitle = document.querySelector('[data-testid="detail-title"]')?.textContent?.trim();
  results.push({
    slot: 'spin',
    pass: disabledDuringSpin && EXPECTED.includes(landedTitle),
    got: landedTitle,
    disabledDuringSpin
  });

  const failed = results.filter((r) => !r.pass);
  console.table(results);
  console.log(failed.length === 0 ? '✅ ALL TOOL-CYLINDER TESTS PASSED' : `❌ ${failed.length} FAILED`, failed);
  return { pass: failed.length === 0, results };
};
