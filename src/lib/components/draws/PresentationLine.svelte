<script>
    let startLine
</script>


<defs>
    <!-- A marker to be used as an arrowhead -->
    <marker
      id="arrow"
      viewBox="0 0 8 8"
      refX="4"
      refY="4"
      markerWidth="8"
      markerHeight={markerHeight}
      orient="auto-start-reverse">
      <path d="M 0 0 L 8 4 L 0 8 z" />
    </marker>
  </defs>
<path {d} marker-start="url(#arrow)"/>