
export const kpis = [
  { label: 'Released Orders', value: '14', subtitle: 'Ready for production' },
  { label: 'Completed Orders', value: '128', subtitle: 'This month' },
  { label: 'In Process', value: '8', subtitle: 'On shop floor' },
  { label: 'Material Shortages', value: '3', subtitle: 'Action Needed' }
];

export const workCenterLoad = [
  { center: 'LINE-01', load: 89 },
  { center: 'LINE-02', load: 93 },
  { center: 'MIX-01', load: 72 },
  { center: 'OVEN-01', load: 81 }
];

export const attentionOrders = [
  { mo: 'MO-000184', item: 'FG-INS-100', qty: '2,500 EA', line: 'LINE-01', status: 'Released', issue: 'Material Shortage' },
  { mo: 'MO-000186', item: 'FG-INS-220', qty: '1,200 EA', line: 'LINE-02', status: 'In Process', issue: 'Operation Late' },
  { mo: 'MO-000190', item: 'FG-ROOF-10', qty: '800 EA', line: 'LINE-03', status: 'Planned', issue: 'Capacity Overload' }
];

export const boms = [
  { id: 'BOM-FG-INS-100', revision: 'A.2', item: 'FG-INS-100', description: 'Insulation Board Standard', status: 'Active' },
  { id: 'BOM-FG-INS-220', revision: 'B.0', item: 'FG-INS-220', description: 'Insulation Board High Density', status: 'Pending' }
];
