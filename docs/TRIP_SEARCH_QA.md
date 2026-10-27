# Trip Search QA

Using a known set of trips, verify:

- exact and partial destination searches where supported,
- whitespace handling,
- case-sensitivity behavior,
- empty query behavior,
- no-match behavior,
- clearing search after filtering.

Check that the displayed result count agrees with the visible records and that request failures are not presented as empty results.