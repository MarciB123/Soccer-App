export type ClubCategory = 'mls' | 'youth_club' | 'high_school' | 'college' | 'recreational' | 'street' | 'fun'

export interface ClubEntry {
  name: string
  category: ClubCategory
  city?: string
}

export const PLAY_CATEGORIES = [
  { value: 'mls', label: 'MLS / Pro Club', icon: 'trophy-outline', description: 'MLS team academy or professional club' },
  { value: 'youth_club', label: 'Youth Club', icon: 'people-outline', description: 'Travel team, ECNL, MLS Next, or local club' },
  { value: 'high_school', label: 'High School', icon: 'school-outline', description: 'High school varsity or JV team' },
  { value: 'college', label: 'College / University', icon: 'library-outline', description: 'NCAA, NAIA, or community college' },
  { value: 'recreational', label: 'Recreational League', icon: 'leaf-outline', description: 'Adult or youth rec league' },
  { value: 'street', label: 'Street / Futsal', icon: 'map-outline', description: 'Street soccer, futsal, pickup games' },
  { value: 'fun', label: 'Just for Fun', icon: 'happy-outline', description: 'Playing for enjoyment, no team' },
] as const

// MLS Teams
export const MLS_CLUBS: ClubEntry[] = [
  { name: 'LA Galaxy', category: 'mls', city: 'Los Angeles, CA' },
  { name: 'LAFC', category: 'mls', city: 'Los Angeles, CA' },
  { name: 'Inter Miami CF', category: 'mls', city: 'Miami, FL' },
  { name: 'Atlanta United FC', category: 'mls', city: 'Atlanta, GA' },
  { name: 'New York City FC', category: 'mls', city: 'New York, NY' },
  { name: 'New York Red Bulls', category: 'mls', city: 'New York, NJ' },
  { name: 'Seattle Sounders FC', category: 'mls', city: 'Seattle, WA' },
  { name: 'Portland Timbers', category: 'mls', city: 'Portland, OR' },
  { name: 'FC Dallas', category: 'mls', city: 'Dallas, TX' },
  { name: 'Columbus Crew', category: 'mls', city: 'Columbus, OH' },
  { name: 'Philadelphia Union', category: 'mls', city: 'Philadelphia, PA' },
  { name: 'Toronto FC', category: 'mls', city: 'Toronto, ON' },
  { name: 'Vancouver Whitecaps', category: 'mls', city: 'Vancouver, BC' },
  { name: 'San Jose Earthquakes', category: 'mls', city: 'San Jose, CA' },
  { name: 'Real Salt Lake', category: 'mls', city: 'Salt Lake City, UT' },
  { name: 'Sporting Kansas City', category: 'mls', city: 'Kansas City, MO' },
  { name: 'Chicago Fire FC', category: 'mls', city: 'Chicago, IL' },
  { name: 'D.C. United', category: 'mls', city: 'Washington, D.C.' },
  { name: 'Colorado Rapids', category: 'mls', city: 'Denver, CO' },
  { name: 'New England Revolution', category: 'mls', city: 'Boston, MA' },
  { name: 'Houston Dynamo', category: 'mls', city: 'Houston, TX' },
  { name: 'Minnesota United', category: 'mls', city: 'Minneapolis, MN' },
  { name: 'Nashville SC', category: 'mls', city: 'Nashville, TN' },
  { name: 'FC Cincinnati', category: 'mls', city: 'Cincinnati, OH' },
  { name: 'Austin FC', category: 'mls', city: 'Austin, TX' },
  { name: 'CF Montréal', category: 'mls', city: 'Montreal, QC' },
  { name: 'Charlotte FC', category: 'mls', city: 'Charlotte, NC' },
  { name: 'St. Louis City SC', category: 'mls', city: 'St. Louis, MO' },
  { name: 'San Diego FC', category: 'mls', city: 'San Diego, CA' },
  { name: 'Orlando City SC', category: 'mls', city: 'Orlando, FL' },
]

// Top US Youth Clubs (ECNL / MLS Next)
export const YOUTH_CLUBS: ClubEntry[] = [
  { name: 'Solar SC', city: 'Dallas, TX', category: 'youth_club' },
  { name: 'De Anza Force', city: 'San Jose, CA', category: 'youth_club' },
  { name: 'Real Colorado', city: 'Denver, CO', category: 'youth_club' },
  { name: 'Crossfire Premier', city: 'Seattle, WA', category: 'youth_club' },
  { name: 'FC Portland', city: 'Portland, OR', category: 'youth_club' },
  { name: 'Revolution Academy', city: 'Boston, MA', category: 'youth_club' },
  { name: 'Red Bulls Academy', city: 'New York, NJ', category: 'youth_club' },
  { name: 'Galaxy Academy', city: 'Los Angeles, CA', category: 'youth_club' },
  { name: 'LAFC/PRE', city: 'Los Angeles, CA', category: 'youth_club' },
  { name: 'Chicago Fire Academy', city: 'Chicago, IL', category: 'youth_club' },
  { name: 'Rapids Academy', city: 'Denver, CO', category: 'youth_club' },
  { name: 'Sporting KC Academy', category: 'youth_club', city: 'Kansas City, MO' },
  { name: 'Union Academy', category: 'youth_club', city: 'Philadelphia, PA' },
  { name: 'Atlanta United Academy', category: 'youth_club', city: 'Atlanta, GA' },
  { name: 'STA (Soccer Training Academy)', category: 'youth_club' },
  { name: 'GPS Portland', category: 'youth_club', city: 'Portland, OR' },
  { name: 'Eagles SC', category: 'youth_club' },
  { name: 'FC Florida', category: 'youth_club', city: 'Florida' },
  { name: 'Michigan Hawks', category: 'youth_club', city: 'Michigan' },
  { name: 'Ohio Premier', category: 'youth_club', city: 'Ohio' },
]

// Top D1 College Programs
export const COLLEGE_CLUBS: ClubEntry[] = [
  { name: 'University of Virginia', category: 'college', city: 'Charlottesville, VA' },
  { name: 'Stanford University', category: 'college', city: 'Stanford, CA' },
  { name: 'Georgetown University', category: 'college', city: 'Washington, D.C.' },
  { name: 'North Carolina (UNC)', category: 'college', city: 'Chapel Hill, NC' },
  { name: 'Indiana University', category: 'college', city: 'Bloomington, IN' },
  { name: 'UCLA', category: 'college', city: 'Los Angeles, CA' },
  { name: 'Duke University', category: 'college', city: 'Durham, NC' },
  { name: 'Wake Forest University', category: 'college', city: 'Winston-Salem, NC' },
  { name: 'Creighton University', category: 'college', city: 'Omaha, NE' },
  { name: 'Michigan State University', category: 'college', city: 'East Lansing, MI' },
  { name: 'Penn State University', category: 'college', city: 'State College, PA' },
  { name: 'Syracuse University', category: 'college', city: 'Syracuse, NY' },
  { name: 'Maryland (UMCP)', category: 'college', city: 'College Park, MD' },
  { name: 'UC Santa Barbara', category: 'college', city: 'Santa Barbara, CA' },
  { name: 'Akron University', category: 'college', city: 'Akron, OH' },
  { name: 'Notre Dame', category: 'college', city: 'Notre Dame, IN' },
  { name: 'Clemson University', category: 'college', city: 'Clemson, SC' },
  { name: 'UC Davis', category: 'college', city: 'Davis, CA' },
  { name: 'University of Portland', category: 'college', city: 'Portland, OR' },
  { name: 'SMU (Southern Methodist)', category: 'college', city: 'Dallas, TX' },
]

export const ALL_SEARCHABLE_CLUBS: ClubEntry[] = [
  ...MLS_CLUBS,
  ...YOUTH_CLUBS,
  ...COLLEGE_CLUBS,
]

export function searchClubs(query: string, category: ClubCategory): ClubEntry[] {
  if (!query.trim()) {
    return ALL_SEARCHABLE_CLUBS.filter((c) => c.category === category).slice(0, 15)
  }
  const q = query.toLowerCase()
  return ALL_SEARCHABLE_CLUBS.filter(
    (c) =>
      c.category === category &&
      (c.name.toLowerCase().includes(q) || (c.city || '').toLowerCase().includes(q))
  ).slice(0, 10)
}
