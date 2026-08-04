# Plan: Fix Broken Links in Program JSON Files

## Goal

Fix all broken links in `assets/cse-programs.json` and `assets/civil-programs.json`

## Current State

- Both files contain university program links
- Links need to be verified and corrected where broken

## Approach

### Phase 1: Link Verification

1. Extract all URLs from both JSON files
2. Test each URL for accessibility (HTTP status codes)
3. Identify broken links (404, 500, timeout, etc.)

### Phase 2: Link Correction

1. For each broken link, find the correct current URL
2. Search university websites for updated program pages
3. Update JSON files with corrected URLs

### Phase 3: Verification

1. Run `npx nuxi build` to ensure no build errors
2. Verify all links are properly formatted
3. Test a sample of corrected links

### Phase 4: Commit

1. Stage changes to both JSON files
2. Commit with descriptive message
3. Report number of links fixed

## Files to Modify

- `D:\Websites\nuxtjs\assets\cse-programs.json`
- `D:\Websites\nuxtjs\assets\civil-programs.json`

## Success Criteria

- All links in both files are accessible
- Build completes successfully
- Changes are committed
