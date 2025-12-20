#!/bin/bash
# Fix conference names in teams.js for 2024-25 season

# Replace underscores with spaces and fix names
sed -i '' \
  -e "s/conference: 'American_Midwest'/conference: 'American Midwest'/g" \
  -e "s/conference: 'Great_Plains'/conference: 'Great Plains'/g" \
  -e "s/conference: 'Red_River'/conference: 'Red River'/g" \
  -e "s/conference: 'Mid-South'/conference: 'Mid-South'/g" \
  -e "s/conference: 'HBCU_Conference'/conference: 'HBCU Conference'/g" \
  -e "s/conference: 'Great_Southwest'/conference: 'Great Southwest'/g" \
  -e "s/conference: 'Heart_of_America'/conference: 'Heart of America'/g" \
  -e "s/conference: 'River_States'/conference: 'River States'/g" \
  -e "s/conference: 'Southern_States'/conference: 'Southern States'/g" \
  -e "s/conference: 'The_Sun'/conference: 'The Sun'/g" \
  -e "s/conference: 'Wolverine-Hoosier'/conference: 'Wolverine-Hoosier'/g" \
  -e "s/conference: 'California_Pacific'/conference: 'California Pacific'/g" \
  config/teams.js

echo "✅ Fixed conference names in teams.js"
