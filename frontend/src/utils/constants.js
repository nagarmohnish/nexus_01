export const ENTITY_TYPES = [
  { value: "LLC", label: "LLC" },
  { value: "S-Corp", label: "S-Corp" },
  { value: "C-Corp", label: "C-Corp" },
  { value: "Sole Proprietorship", label: "Sole Proprietorship" },
  { value: "Partnership", label: "Partnership" },
];

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
];

export const CONTRACTOR_TYPES = [
  { value: "ongoing", label: "Ongoing" },
  { value: "project_based", label: "Project-Based" },
];

export const LOCATION_TYPES = [
  { value: "headquarters", label: "Headquarters" },
  { value: "branch", label: "Branch Office" },
  { value: "coworking", label: "Co-working Space" },
  { value: "warehouse", label: "Warehouse" },
  { value: "data_center", label: "Data Center" },
  { value: "other", label: "Other" },
];

export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export const NEXUS_STATUS_CONFIG = {
  definite: {
    label: "Definite Nexus",
    color: "bg-red-100 text-red-800 border-red-200",
    dotColor: "bg-red-500",
  },
  probable: {
    label: "Probable Nexus",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    dotColor: "bg-orange-500",
  },
  possible: {
    label: "Possible Nexus",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
  },
  no_nexus: {
    label: "No Nexus",
    color: "bg-green-100 text-green-800 border-green-200",
    dotColor: "bg-green-500",
  },
};

export const REASON_CODE_LABELS = {
  EMPLOYEE_PRESENT: "Employee(s) in state",
  CONTRACTOR_PRESENT: "Contractor(s) in state",
  OFFICER_RESIDENT: "Officer/Director resident",
  OFFICE_LOCATION: "Office/HQ location",
  WAREHOUSE_LOCATION: "Warehouse location",
  COWORKING_LOCATION: "Co-working space",
  REGISTERED_AGENT: "Registered agent",
  STATE_OF_INCORPORATION: "State of incorporation",
  ECONOMIC_NEXUS_INCOME_TAX: "Revenue exceeds income tax threshold",
  ECONOMIC_NEXUS_SALES_TAX: "Revenue exceeds sales tax threshold",
  ECONOMIC_NEXUS_FRANCHISE_TAX: "Revenue exceeds franchise tax threshold",
  ECONOMIC_NEXUS_GROSS_RECEIPTS: "Revenue exceeds gross receipts threshold",
  ESTIMATED_REVENUE_FROM_TRAFFIC: "Estimated revenue from traffic data",
};

export const REVENUE_SOURCES = [
  { key: "advertising_mediavine", label: "Mediavine" },
  { key: "advertising_raptive", label: "Raptive" },
  { key: "advertising_adsense", label: "AdSense" },
  { key: "advertising_other", label: "Other Ad Revenue" },
  { key: "syndication_msn", label: "MSN Syndication" },
  { key: "syndication_newsbreak", label: "Newsbreak" },
  { key: "syndication_other", label: "Other Syndication" },
  { key: "newsletter_revenue", label: "Newsletter Revenue" },
  { key: "affiliate_revenue", label: "Affiliate Revenue" },
  { key: "sponsored_content", label: "Sponsored Content" },
  { key: "direct_sales", label: "Direct Sales" },
  { key: "other_revenue", label: "Other Revenue" },
];
