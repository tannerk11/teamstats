#!/bin/bash
# Batch extract multiple conferences
# Usage: bash scripts/extractBatch.sh

echo "🚀 Starting batch extraction of 17 conferences..."
echo ""

conferences=(
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/California_Pacific/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Chicagoland/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Continental/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Crossroads/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Frontier/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Great_Plains/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Great_Southwest/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/HBCU_Conference/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Heart_of_America/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/KCAC/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Mid-South/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Red_River/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/River_States/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Sooner/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Southern_States/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/The_Sun/teams?jsRendering=true"
  "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Wolverine-Hoosier/teams?jsRendering=true"
)

# Output file
output_file="extracted_teams_batch.txt"
> "$output_file"  # Clear the file

echo "Extracting teams from ${#conferences[@]} conferences..."
echo "Results will be saved to: $output_file"
echo ""

for i in "${!conferences[@]}"; do
  conf_url="${conferences[$i]}"
  conf_num=$((i + 1))
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "[$conf_num/${#conferences[@]}] Processing: $conf_url"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Run extraction and append to output file
  node scripts/extractConferenceTeams.js "$conf_url" >> "$output_file" 2>&1
  
  echo ""
  
  # Small delay between conferences to be nice to the server
  if [ $conf_num -lt ${#conferences[@]} ]; then
    sleep 1
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Batch extraction complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 All results saved to: $output_file"
echo ""
echo "Next steps:"
echo "  1. Open $output_file"
echo "  2. Copy the team objects"
echo "  3. Paste them into config/teams.js"
echo "  4. Replace 'CONFERENCE_NAME_HERE' with actual conference names"
echo ""
