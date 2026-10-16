// EDIT THIS FILE to add or update threat hunts, ATT&CK mappings and simulation counts.
// These are public-safe catalogue entries, NOT live Azure data or private KQL.
// IMPORTANT: keep the IDs aligned in hunts, attackCatalog and scenario counts.

const hunts=[
{id:'TH-001',name:'Entra ID Group Management Activity',table:'AuditLogs',term:'group',detail:'Group creation and membership changes',notes:'No matching group management activity identified under configured criteria.'},
{id:'TH-002',name:'Privileged Role Assignment Activity',table:'AuditLogs',term:'role',detail:'Changes to privileged role assignments',notes:'No matching privileged role assignments identified under configured criteria.'},
{id:'TH-003',name:'Failed Sign-ins Followed by Success',table:'SigninLogs',term:'ResultType',detail:'Authentication patterns that warrant investigation',notes:'No matching authentication sequences identified under configured criteria.'},
{id:'TH-004',name:'Conditional Access Policy Changes',table:'AuditLogs',term:'conditional access',detail:'Changes to Conditional Access policies',notes:'No matching Conditional Access policy changes identified under configured criteria.'},
{id:'TH-005',name:'Application and Service Principal Changes',table:'AuditLogs',term:'application',detail:'Changes to application and service principal configuration',notes:'No matching application changes identified under configured criteria.'},
{id:'TH-006',name:'Suspicious Sign-ins from Multiple IP Addresses',table:'SigninLogs',term:'IPAddress',detail:'Multiple-source sign-in activity',notes:'No matching multi-IP sign-in patterns identified under configured criteria.'},
{id:'TH-007',name:'Entra ID User Creation by Unauthorised Accounts',table:'AuditLogs',term:'user',detail:'User creation outside approved initiator criteria',notes:'No matching unauthorised user creation identified under configured criteria.'},
{id:'TH-008',name:'Non-owner Mailbox Access Activity',table:'OfficeActivity',term:'MailItemsAccessed',detail:'Mailbox access matching configured non-owner criteria',notes:'No matching non-owner mailbox access identified in available telemetry.'},
{id:'TH-009',name:'External Mail Forwarding Destinations',table:'OfficeActivity',term:'forward',detail:'External mail forwarding configuration',notes:'No matching external forwarding changes identified under configured criteria.'},
{id:'TH-010',name:'Privileged Group Membership Changes',table:'AuditLogs',term:'member',detail:'Membership changes in sensitive groups',notes:'No matching privileged group changes identified under configured criteria.'}
];

const scenarios={baseline:[7,7,0,0,2,0,0,0,0,0],zero:[0,0,0,0,0,0,0,0,0,0],elevated:[9,11,5,0,8,6,0,3,0,0]};

const attackCatalog=[
['TH-001','Entra ID Group Management Activity','Medium','Reviewed','AuditLogs',['TA0003','TA0004'],['T1098']],
['TH-002','Privileged Role Assignment Activity','High','Candidate','AuditLogs',['TA0003','TA0004'],['T1098','T1098.003']],
['TH-003','Failed Sign-ins Followed by Success','High','Candidate','SigninLogs',['TA0006'],['T1110']],
['TH-004','Conditional Access Policy Changes','Medium','Reviewed','AuditLogs',['TA0006'],['T1556.009']],
['TH-005','Application and Service Principal Changes','Medium','Candidate','AuditLogs',['TA0003','TA0004'],['T1098','T1098.001']],
['TH-006','Suspicious Sign-ins from Multiple IP Addresses','Medium','Candidate','SigninLogs',['TA0001','TA0005'],['T1078','T1078.004']],
['TH-007','User created by unauthorized user','High','Candidate','AuditLogs',['TA0003'],['T1136','T1136.003']],
['TH-008','Non-owner mailbox login activity','Medium','Candidate','OfficeActivity',['TA0009'],['T1114','T1114.002']],
['TH-009','External Mail Forwarding Destinations','High','Candidate','OfficeActivity',['TA0009'],['T1114','T1114.003']],
['TH-010','Privileged Group Membership Changes','High','Candidate','AuditLogs',['TA0003','TA0004'],['T1098']]
].map(([id,name,priority,status,source,tactics,techniques])=>({id,name,priority,status,source,tactics,techniques,validation:'Untested',telemetry:'To Verify',publication:'Private'}));

const tacticNames={'TA0001':'Initial Access','TA0003':'Persistence','TA0004':'Privilege Escalation','TA0005':'Defense Evasion','TA0006':'Credential Access','TA0009':'Collection'};

const techniqueNames={'T1098':'Account Manipulation','T1098.003':'Additional Cloud Roles','T1098.001':'Additional Cloud Credentials','T1110':'Brute Force','T1556.009':'Conditional Access Policies','T1078':'Valid Accounts','T1078.004':'Cloud Accounts','T1136':'Create Account','T1136.003':'Cloud Account','T1114':'Email Collection','T1114.002':'Remote Email Collection','T1114.003':'Email Forwarding Rule'};
