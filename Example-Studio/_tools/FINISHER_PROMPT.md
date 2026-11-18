A previous builder (cut off by a usage limit or an error) already wrote your part file `Boards/src/<PART>.jsx`. Do NOT start over.

1. **Read the brief:** read `_tools/BUILDER_PROMPT.md` (filled for this part) and everything it lists.
2. **Check the part file against PAGES.md**, and fill every gap:
   - every screen ID, including `p` phone variants, and every listed state is present
   - ChapterBand narratives are verbatim
   - screen counts are right
   - every chapter ends with a FlowStrip
   - numbers match the canonical facts and the fixture
   - the file is syntactically complete (the previous builder may have stopped mid-file)
3. **Run the full Build & QA loop** from BUILD_SPEC.md: build-part, smoke, capture light and dark, axe light and dark.
4. **Look and fix:** LOOK at every captured PNG in both languages. Fix clipping, overlap, broken RTL and awkward Arabic until clean.

Report exactly as BUILD_SPEC.md "Report" says.
