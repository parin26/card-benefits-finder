
const variantMap = {
  "HDFC Bank|Credit Card": ["Millennia","MoneyBack+","Freedom","PhonePe HDFC Bank Uno","PhonePe HDFC Bank Ultimo","Infinia Metal Edition","Diners Club Black Metal Edition","PIXEL Play","PIXEL Go","HDFC Bank UPI RuPay","Regalia Gold","Diners Club Privilege","Tata Neu Infinity","Tata Neu Plus","Swiggy","Swiggy Ornge","Swiggy BLCK","Marriott Bonvoy","Indian Oil","IRCTC"],
  "HDFC Bank|Debit Card": ["Platinum","Regular","Preferred Platinum","Classic Platinum","Womans Advantage","Titanium","Times Points","Moneyback","Infiniti","Gold"],
  "ICICI Bank|Credit Card": ["Amazon Pay","Coral","Rubyx","Sapphiro","Emeralde","Emerald Private Metal","Diamant","Times Black","MakeMyTrip","HPCL Coral","HPCL Super Saver","Manchester United","Adani One Signature"],
  "ICICI Bank|Debit Card": ["Coral Debit","Sapphiro Debit","Platinum Debit"],
  "State Bank of India|Credit Card": ["SimplyCLICK","SimplySAVE","SimplySAVE UPI","Prime","Elite","Elite Advantage","Pulse","Aurum","Cashback","BPCL","BPCL Octane","Air India Signature","Air India Platinum","IRCTC","IRCTC RuPay","Etihad Guest","Central","Yatra SBI","Tata Croma","Unnati","Miles","Miles Prime","Miles Elite","Doctor's SBI Card","Vistara Signature","Vistara Prime","Reliance Prime","Titan","Lifestyle Prime"],
  "State Bank of India|Debit Card": ["Classic","Gold","Platinum","Pride"],
  "Axis Bank|Credit Card": ["Ace","Flipkart","My Zone","Neo","Airtel","Rewards","Privilege","Select","Magnus","Horizon","Atlas","Primus","Burgundy Private","Reserve","Vistara Signature","Vistara Prime","IndianOil","IndianOil Premium"],
  "Axis Bank|Debit Card": ["Burgundy Debit","Priority Debit","Republic Debit","Flipkart Debit","Kisan Debit","Sampann Debit","Prestige Debit","PMJDY Debit","Delight Debit","Value Plus Debit","Online Rewards Debit"],
  "Kotak Mahindra Bank|Credit Card": ["League Platinum","Royale Signature","White Reserve","811 Dream Different","Delight Platinum","PVR Gold","PVR Platinum","IndianOil","Myntra","IndiGo 6E Rewards","Mojo Platinum","Kotak UPI RuPay"],
  "Kotak Mahindra Bank|Debit Card": ["Classic Debit","Privy League Signature","Platinum Debit"],
  "RBL Bank|Credit Card": ["LUMIERE","NOVA","IRCTC RBL Bank","IndianOil RBL Bank XTRA","IndianOil RBL Bank","Aspire Banking","Signature Banking","Apex","Icon","World Safari","World Safari Lite","RBL Bank QuickPay","RBL Bank iGlobe","Platinum Maxima Plus","Platinum Maxima","Platinum Delight","ShopRite","Cookies","RBL Bank Play","RBL Bank SalarySe UP","TVS Credit RBL Bank Gold","TVS Credit RBL Bank","RBL Bank DMI Finance","RBL Bank Patanjali Vishisht","RBL Bank Patanjali Swarn","RBL Bank Bankbazaar SaveMax","RBL Bank Bankbazaar SaveMax Pro","RBL Bank MoneyTap Black","RBL Bank MoneyTap","RBL Bank Paisabazaar Duet","RBL Bank Paisabazaar Duet Plus","Insignia Preferred Banking","Monthly Treats","RBL Bank Popcorn","RBL Bank Movies and More","RBL Bank Blockbuster","Titanium Delight","RBL Bank Fun+","MoCash","Platinum LifeEasy","Platinum Edge","Platinum ShopDaily","Platinum Plus","World Prime","Platinum TravelEasy","Platinum ShopSmart","Platinum ValuePlus","Platinum Max","World Max","Platinum Classic","Platinum Prime","Platinum Bonus","Platinum Shopgain","Binge","MyFirst","EasySaver","Platinum Advantage","World Plus","Platinum Choice"],
  "RBL Bank|Debit Card": ["Titanium Debit","Platinum Debit"],
  "Canara Bank|Credit Card": ["Visa Signature","Rupay Select","Mastercard World","Visa Platinum","Rupay Select Secured","Mastercard Platinum","Rupay Platinum","Mastercard Gold","Visa Gold","Rupay Platinum Secured","Mastercard Gold Secured","Visa Gold Secured","Rupay Classic","Mastercard Standard","Visa Classic"],
  "Canara Bank|Debit Card": ["Classic Debit","Platinum Debit"],
  "IndusInd Bank|Credit Card": ["Platinum RuPay","Legend","EazyDiner","EazyDiner Platinum","Platinum Aura Edge","Platinum Visa","Pinnacle","Nexxt","Tiger","Samman","Avios Visa Infinite"],
  "IndusInd Bank|Debit Card": ["Platinum Debit","EasyAccess Debit","Pioneer Debit"],
  "Yes Bank|Credit Card": ["Marquee","Private","Prime","Elite+","Reserv","POP Club","First Preferred","Klick","SELECT","FinBooster","First Business","Paisabazaar PaisaSave","ACE"],
  "Yes Bank|Debit Card": ["Prosperity Debit","Elite Debit","Classic Debit"],
  "IDFC FIRST Bank|Credit Card": ["FIRST Millennia","FIRST Classic","FIRST Select","FIRST Wealth","FIRST WOW!","FIRST WOW! Black","FIRST SWYP","FIRST EARN","FIRST Power","FIRST Power+","LIC Classic","LIC Select","FIRST Private","Ashva","Mayura","Gaj","Diamond Reserve","IndiGo","Hello Cashback","FIRST Digital"],
  "IDFC FIRST Bank|Debit Card": ["FIRST Classic Debit","FIRST Select Debit","FIRST Wealth Debit","FIRST Private Debit","Visa Signature Debit","Visa Platinum Debit","Visa Classic Debit"],
  "Bank of Baroda|Credit Card": ["BOBCARD Eterna","BOBCARD Prime","BOBCARD Select","BOBCARD Tiara","BOBCARD Easy","BOBCARD Premier","BOBCARD Cashback","BOBCARD One","IRCTC RuPay","HPCL Energie","ICAI Exclusive","ICSI Diamond","CMA One","Vikram","Yoddha","Sentinel"],
  "Bank of Baroda|Debit Card": ["Classic Debit","Platinum Debit","RuPay Select Debit"],
  "Punjab National Bank|Credit Card": ["Global Classic","Global Gold","Global Platinum","Global Select","Visa Signature","RuPay Platinum","RuPay Select","RuPay Millennial","Rakshak","EaseMyTrip RuPay Platinum","Patanjali RuPay Select","Luxura Metal"],
  "Punjab National Bank|Debit Card": ["RuPay Select Neo","RuPay Select Excel","RuPay Select Optima","RuPay Select Imperial","RuPay Select Rakshak","RuPay Select Government Imperial","RuPay Select Government Optima","RuPay Select Government Excel","Mastercard World Grand"],
  "Standard Chartered|Credit Card": ["Rewards","Platinum Rewards","Ultimate","EaseMyTrip"],
  "Standard Chartered|Debit Card": ["Corporate Debit","Priority Banking Debit"],
  "American Express India|Credit Card": ["Membership Rewards","Platinum Travel","Platinum Reserve","SmartEarn"]
};
const genericFallback = ["Classic","Gold","Platinum","Signature","Business"];
const banks = ["HDFC Bank","ICICI Bank","State Bank of India","Axis Bank","Kotak Mahindra Bank","IndusInd Bank","Yes Bank","IDFC FIRST Bank","Bank of Baroda","Punjab National Bank","Standard Chartered","American Express India","RBL Bank","Canara Bank"];
const networks = ["Any / not sure","Visa","Mastercard","RuPay","American Express","Diners Club"];
const networkAvailability = {
  "HDFC Bank|Credit Card|Regalia Gold": ["Visa","Mastercard"],
  "HDFC Bank|Credit Card|Diners Club Black Metal Edition": ["Diners Club","Mastercard"],
  "HDFC Bank|Credit Card|Diners Club Privilege": ["Diners Club","Mastercard"],
  "HDFC Bank|Credit Card|Infinia Metal Edition": ["Visa","Mastercard"],
  "HDFC Bank|Credit Card|Millennia": ["Visa","Mastercard","RuPay"],
  "HDFC Bank|Credit Card|MoneyBack+": ["Visa","Mastercard","RuPay"],
  "HDFC Bank|Credit Card|Freedom": ["Visa","RuPay"],
  "HDFC Bank|Credit Card|Tata Neu Infinity": ["Visa","RuPay"],
  "HDFC Bank|Credit Card|Tata Neu Plus": ["Visa","RuPay"],
  "HDFC Bank|Credit Card|Swiggy": ["Visa"],
  "HDFC Bank|Credit Card|HDFC Bank UPI RuPay": ["RuPay"],
  "ICICI Bank|Credit Card|Amazon Pay": ["Visa"],
  "ICICI Bank|Credit Card|Coral": ["Visa","Mastercard","RuPay"],
  "ICICI Bank|Credit Card|Rubyx": ["Visa","Mastercard","RuPay"],
  "ICICI Bank|Credit Card|Sapphiro": ["Visa","Mastercard","RuPay"],
  "ICICI Bank|Credit Card|Emeralde": ["Visa","Mastercard","American Express"],
  "ICICI Bank|Credit Card|Emerald Private Metal": ["Visa","Mastercard"],
  "ICICI Bank|Credit Card|Times Black": ["Visa","Mastercard"],
  "ICICI Bank|Credit Card|MakeMyTrip": ["Mastercard","RuPay"],
  "ICICI Bank|Credit Card|HPCL Super Saver": ["Visa","Mastercard","RuPay"],
  "State Bank of India|Credit Card|SimplyCLICK": ["Visa","Mastercard","RuPay"],
  "State Bank of India|Credit Card|Aurum": ["Mastercard","RuPay"],
  "State Bank of India|Credit Card|SimplySAVE": ["Visa","Mastercard","RuPay"],
  "State Bank of India|Credit Card|Prime": ["Visa","Mastercard"],
  "State Bank of India|Credit Card|Elite": ["Visa","Mastercard"],
  "State Bank of India|Credit Card|Cashback": ["Visa","Mastercard"],
  "State Bank of India|Credit Card|BPCL": ["Visa","Mastercard"],
  "Axis Bank|Credit Card|Ace": ["Visa","RuPay"],
  "Axis Bank|Credit Card|Flipkart": ["Visa","Mastercard"],
  "Axis Bank|Credit Card|Magnus": ["Visa","Mastercard","RuPay"],
  "Axis Bank|Credit Card|My Zone": ["Visa","Mastercard"],
  "Axis Bank|Credit Card|Neo": ["Mastercard","RuPay"],
  "Axis Bank|Credit Card|Airtel": ["Visa","RuPay"],
  "Axis Bank|Credit Card|Rewards": ["Mastercard"],
  "Axis Bank|Credit Card|Privilege": ["Mastercard"],
  "Axis Bank|Credit Card|Select": ["Mastercard"],
  "Axis Bank|Credit Card|Horizon": ["Visa"],
  "Axis Bank|Credit Card|Atlas": ["Visa"],
  "Axis Bank|Credit Card|Primus": ["Visa"],
  "Axis Bank|Credit Card|Burgundy Private": ["Visa","Mastercard"],
  "Axis Bank|Credit Card|Reserve": ["Visa"],
  "Axis Bank|Credit Card|Vistara Signature": ["Visa"],
  "Axis Bank|Credit Card|Vistara Prime": ["Visa"],
  "Axis Bank|Credit Card|IndianOil": ["Visa","RuPay"],
  "Axis Bank|Credit Card|IndianOil Premium": ["Visa"],
  "Kotak Mahindra Bank|Credit Card|League Platinum": ["Visa","Mastercard"],
  "Kotak Mahindra Bank|Credit Card|Royale Signature": ["Visa","Mastercard"],
  "Kotak Mahindra Bank|Credit Card|White Reserve": ["Visa","Mastercard"],
  "Kotak Mahindra Bank|Credit Card|811 Dream Different": ["Visa","RuPay"],
  "Kotak Mahindra Bank|Credit Card|Kotak UPI RuPay": ["RuPay"],
  "RBL Bank|Credit Card|World Safari": ["Visa","Mastercard","RuPay"],
  "RBL Bank|Credit Card|ShopRite": ["Visa","Mastercard","RuPay"],
  "RBL Bank|Credit Card|Insignia Preferred Banking": ["Visa","Mastercard"],
  "RBL Bank|Credit Card|RBL Bank Play": ["RuPay"],
  "Canara Bank|Credit Card|Visa Signature": ["Visa"],
  "Canara Bank|Credit Card|Rupay Select": ["RuPay"],
  "Canara Bank|Credit Card|Mastercard World": ["Mastercard"],
  "Canara Bank|Credit Card|Visa Platinum": ["Visa"],
  "Canara Bank|Credit Card|Rupay Select Secured": ["RuPay"],
  "Canara Bank|Credit Card|Mastercard Platinum": ["Mastercard"],
  "Canara Bank|Credit Card|Rupay Platinum": ["RuPay"],
  "Canara Bank|Credit Card|Mastercard Gold": ["Mastercard"],
  "Canara Bank|Credit Card|Visa Gold": ["Visa"],
  "Canara Bank|Credit Card|Rupay Platinum Secured": ["RuPay"],
  "Canara Bank|Credit Card|Mastercard Gold Secured": ["Mastercard"],
  "Canara Bank|Credit Card|Visa Gold Secured": ["Visa"],
  "Canara Bank|Credit Card|Rupay Classic": ["RuPay"],
  "Canara Bank|Credit Card|Mastercard Standard": ["Mastercard"],
  "Canara Bank|Credit Card|Visa Classic": ["Visa"],
  "IndusInd Bank|Credit Card|Pinnacle": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|Legend": ["Visa","Mastercard","RuPay"],
  "IndusInd Bank|Credit Card|EazyDiner": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|EazyDiner Platinum": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|Platinum Aura Edge": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|Platinum RuPay": ["RuPay"],
  "IndusInd Bank|Credit Card|Platinum Visa": ["Visa"],
  "IndusInd Bank|Credit Card|Nexxt": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|Tiger": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|Samman": ["Visa","Mastercard"],
  "IndusInd Bank|Credit Card|Avios Visa Infinite": ["Visa"],
  "Yes Bank|Credit Card|Marquee": ["Visa","Mastercard"],
  "Yes Bank|Credit Card|Private": ["Visa","Mastercard"],
  "Yes Bank|Credit Card|Prime": ["Visa","Mastercard"],
  "Yes Bank|Credit Card|Elite+": ["Visa","Mastercard"],
  "Yes Bank|Credit Card|Reserv": ["Visa","Mastercard"],
  "Yes Bank|Credit Card|POP Club": ["Visa","Mastercard","RuPay"],
  "Yes Bank|Credit Card|First Preferred": ["Visa","Mastercard"],
  "Yes Bank|Credit Card|Klick": ["RuPay"],
  "Yes Bank|Credit Card|FinBooster": ["RuPay"],
  "Yes Bank|Credit Card|Paisabazaar PaisaSave": ["RuPay"],
  "Yes Bank|Credit Card|SELECT": ["Visa","Mastercard"],
  "IDFC FIRST Bank|Credit Card|FIRST Millennia": ["Visa","Mastercard","RuPay"],
  "IDFC FIRST Bank|Credit Card|FIRST Classic": ["Visa","Mastercard","RuPay"],
  "IDFC FIRST Bank|Credit Card|FIRST Select": ["Visa","Mastercard"],
  "IDFC FIRST Bank|Credit Card|FIRST Wealth": ["Visa","Mastercard"],
  "IDFC FIRST Bank|Credit Card|FIRST WOW!": ["RuPay"],
  "IDFC FIRST Bank|Credit Card|FIRST WOW! Black": ["RuPay"],
  "IDFC FIRST Bank|Credit Card|LIC Classic": ["Mastercard"],
  "IDFC FIRST Bank|Credit Card|LIC Select": ["Mastercard"],
  "IDFC FIRST Bank|Credit Card|IndiGo": ["Mastercard","RuPay"],
  "IDFC FIRST Bank|Credit Card|Ashva": ["Visa","Mastercard"],
  "IDFC FIRST Bank|Credit Card|Mayura": ["Visa","Mastercard"],
  "IDFC FIRST Bank|Credit Card|FIRST Private": ["Visa","Mastercard"],
  "IDFC FIRST Bank|Credit Card|FIRST SWYP": ["Visa","Mastercard","RuPay"],
  "Bank of Baroda|Credit Card|BOBCARD Eterna": ["Visa","Mastercard","RuPay"],
  "Bank of Baroda|Credit Card|BOBCARD Prime": ["Visa","Mastercard","RuPay"],
  "Bank of Baroda|Credit Card|BOBCARD Select": ["Visa","Mastercard"],
  "Bank of Baroda|Credit Card|BOBCARD Tiara": ["Visa","Mastercard","RuPay"],
  "Bank of Baroda|Credit Card|BOBCARD Easy": ["Visa","RuPay"],
  "Bank of Baroda|Credit Card|IRCTC RuPay": ["RuPay"],
  "Punjab National Bank|Credit Card|Global Classic": ["Visa"],
  "Punjab National Bank|Credit Card|Global Gold": ["Visa"],
  "Punjab National Bank|Credit Card|Global Platinum": ["Visa"],
  "Punjab National Bank|Credit Card|Global Select": ["Visa"],
  "Punjab National Bank|Credit Card|Visa Signature": ["Visa"],
  "Punjab National Bank|Credit Card|RuPay Platinum": ["RuPay"],
  "Punjab National Bank|Credit Card|RuPay Select": ["RuPay"],
  "Punjab National Bank|Credit Card|RuPay Millennial": ["RuPay"],
  "Punjab National Bank|Credit Card|Rakshak": ["RuPay"],
  "Punjab National Bank|Credit Card|EaseMyTrip RuPay Platinum": ["RuPay"],
  "Punjab National Bank|Credit Card|Patanjali RuPay Select": ["RuPay"],
  "Punjab National Bank|Credit Card|Luxura Metal": ["RuPay","Visa"],
  "Punjab National Bank|Debit Card|RuPay Select Neo": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Excel": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Optima": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Imperial": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Rakshak": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Government Imperial": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Government Optima": ["RuPay"],
  "Punjab National Bank|Debit Card|RuPay Select Government Excel": ["RuPay"],
  "Punjab National Bank|Debit Card|Mastercard World Grand": ["Mastercard"],
  "Standard Chartered|Credit Card|Rewards": ["Visa","Mastercard"],
  "Standard Chartered|Credit Card|Platinum Rewards": ["Visa","Mastercard"],
  "Standard Chartered|Credit Card|Ultimate": ["Visa","Mastercard"],
  "Standard Chartered|Credit Card|EaseMyTrip": ["Visa","Mastercard"],
  "American Express India|Credit Card|Membership Rewards": ["American Express"],
  "American Express India|Credit Card|Platinum Travel": ["American Express"],
  "American Express India|Credit Card|Platinum Reserve": ["American Express"],
  "American Express India|Credit Card|SmartEarn": ["American Express"]
};
function networksFor(bank, cardType, variant) {
  const known = networkAvailability[bank + '|' + cardType + '|' + variant];
  if (known) return known;
  if (bank === 'RBL Bank' && cardType === 'Credit Card') return ["Visa","Mastercard","RuPay"];
  return cardType === 'Debit Card' ? ["Visa","Mastercard","RuPay"] : ["Visa","Mastercard"];
}

const tierKeywords = {
  super: ['metal','black','infinite','private','signature','pinnacle','celesta','emeralde','luxura','reserve','reserv','mayura','ashva','magnus','infinia'],
  premium: ['gold','regalia','millennia','legend','eterna','select','wealth','sapphiro','elite','marquee'],
  mid: ['platinum','prime','classic','rubyx','coral']
};
function tierFor(variant) {
  const v = (variant || '').toLowerCase();
  if (tierKeywords.super.some(k => v.includes(k))) return 'super';
  if (tierKeywords.premium.some(k => v.includes(k))) return 'premium';
  if (tierKeywords.mid.some(k => v.includes(k))) return 'mid';
  return 'entry';
}
const tierColors = {
  entry: 'linear-gradient(135deg, #4B5A63, #6B7C87)',
  mid: 'linear-gradient(135deg, #143C35, #205C52)',
  premium: 'linear-gradient(135deg, #7A5817, #C9962E)',
  super: 'linear-gradient(135deg, #0D0F0D, #2A2E2A)'
};
const networkColors = {
  'Visa': '#1A3E8C', 'Mastercard': '#B23A2E', 'RuPay': '#0F7A4A',
  'American Express': '#5B4A8A', 'Diners Club': '#3A3F44', '': '#5C6B62'
};
const networkPortals = {
  'Visa': { url: 'https://www.visa.co.in/en_in/visa-offers-and-perks/', note: 'Visa Offers and Perks' },
  'Mastercard': { url: 'https://www.mastercard.co.in/en-in/personal/offers-and-promotions.html', note: 'Mastercard offers and priceless specials' },
  'RuPay': { url: 'https://rupayselect.truztee.com/#/offers', note: 'RuPay Select benefits (Select-tier cards only)' },
  'American Express': { url: 'https://www.americanexpress.com/en-in/benefits/amex-offers/offers/', note: 'Amex Offers' },
  'Diners Club': { url: 'https://dinersclub-offerplatform.com/', note: 'Diners Club Offers Platform' }
};

function createVariantCombo(container, onChange) {
  const input = container.querySelector('.variant-input');
  const dropdown = container.querySelector('.variant-dropdown');
  let options = [];
  let value = '';
  let highlightedIndex = -1;

  function filteredOptions() {
    const q = input.value.toLowerCase();
    if (!q) return options;
    return options.filter(o => o.toLowerCase().includes(q));
  }

  function renderList(list) {
    highlightedIndex = -1;
    if (!list.length) {
      dropdown.innerHTML = '<div class="variant-empty">No match - your typed text will be used as-is.</div>';
    } else {
      dropdown.innerHTML = list.map(o => '<div class="variant-option" data-value="' + o.replace(/"/g, '&quot;') + '">' + o + '</div>').join('');
    }
    dropdown.hidden = false;
  }

  // Opening the field (focus/click) always shows the FULL list, regardless of the
  // current value already in the box - otherwise the pre-filled text filters itself
  // out to a single match the instant you open it.
  function openFullList() {
    renderList(options);
    input.select();
  }
  // Actively typing narrows the list to what's been typed so far.
  function filterAsTyped() {
    renderList(filteredOptions());
  }

  function updateHighlight(items) {
    items.forEach((it, i) => it.classList.toggle('highlighted', i === highlightedIndex));
    if (items[highlightedIndex]) items[highlightedIndex].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('focus', openFullList);
  input.addEventListener('click', openFullList);
  input.addEventListener('input', filterAsTyped);
  input.addEventListener('blur', () => {
    setTimeout(() => {
      dropdown.hidden = true;
      value = input.value.trim() || options[0] || '';
      input.value = value;
      onChange(value);
    }, 150);
  });
  dropdown.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.variant-option');
    if (!item) return;
    value = item.dataset.value;
    input.value = value;
    dropdown.hidden = true;
    onChange(value);
  });
  input.addEventListener('keydown', (e) => {
    const items = Array.from(dropdown.querySelectorAll('.variant-option'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
      updateHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      updateHighlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      value = (highlightedIndex >= 0 && items[highlightedIndex]) ? items[highlightedIndex].dataset.value : (input.value.trim() || value);
      input.value = value;
      dropdown.hidden = true;
      onChange(value);
      input.blur();
    } else if (e.key === 'Escape') {
      dropdown.hidden = true;
      input.blur();
    }
  });

  return {
    setOptions(newOptions) {
      options = newOptions;
      if (!value || !options.includes(value)) {
        value = options[0] || '';
        input.value = value;
      }
    },
    getValue() { return value; },
    setValue(v) { value = v; input.value = v; }
  };
}

function updateMock(mockEl, card) {
  if (!mockEl) return;
  const tier = tierFor(card.variant);
  mockEl.style.background = tierColors[tier];
  mockEl.querySelector('.card-mock-bank').textContent = card.bank || 'Bank';
  mockEl.querySelector('.card-mock-variant').textContent = card.variant || 'Variant';
  mockEl.querySelector('.card-mock-network').textContent = (card.network || 'Any network').toUpperCase();
  mockEl.querySelector('.card-mock-network').style.background = (networkColors[card.network] || networkColors['']) ;
  mockEl.querySelector('.card-mock-network').style.color = '#fff';
  mockEl.querySelectorAll('[id^=mockType]').forEach(el => { el.textContent = card.cardType || 'Credit card'; });
  const dotsEl = mockEl.querySelector('.card-mock-dots');
  if (dotsEl) dotsEl.textContent = card.bin ? card.bin + ' •• 1234' : '•••• 1234';
}

function initPicker(root, mockEl) {
  const bankSel = root.querySelector('.bank');
  const typeSel = root.querySelector('.cardType');
  const netSel = root.querySelector('.network');
  const binInput = root.querySelector('.bin');
  const binToggle = root.querySelector('.bin-toggle');
  const binField = root.querySelector('.bin-field');
  const variantCombo = createVariantCombo(root.querySelector('.variant-combo'), () => {
    if (mockEl) updateMock(mockEl, picker.get());
  });
  if (binToggle && binField) {
    binToggle.addEventListener('click', () => {
      const isOpen = binField.classList.toggle('open');
      binToggle.classList.toggle('open', isOpen);
      binToggle.innerHTML = '<i class="ti ti-chevron-down"></i> ' + (isOpen ? 'Hide card BIN field' : 'I have my card handy (optional)');
    });
  }
  banks.forEach(b => { const o = document.createElement('option'); o.value = b; o.textContent = b; bankSel.appendChild(o); });
  if (netSel) networks.forEach(n => { const o = document.createElement('option'); o.value = n === 'Any / not sure' ? '' : n; o.textContent = n; netSel.appendChild(o); });
  function refresh() {
    const fullList = variantMap[bankSel.value + '|' + typeSel.value] || genericFallback;
    const selectedNetwork = netSel ? netSel.value : '';
    const filtered = selectedNetwork
      ? fullList.filter(v => networksFor(bankSel.value, typeSel.value, v).includes(selectedNetwork))
      : fullList;
    variantCombo.setOptions(filtered);
    if (binInput && selectedNetwork) {
      const savedBin = localStorage.getItem('bin:' + selectedNetwork) || '';
      binInput.value = savedBin;
      if (savedBin && binField && !binField.classList.contains('open')) {
        binField.classList.add('open');
        if (binToggle) { binToggle.classList.add('open'); binToggle.innerHTML = '<i class="ti ti-chevron-down"></i> Hide card BIN field'; }
      }
    }
    if (mockEl) updateMock(mockEl, picker.get());
  }
  bankSel.addEventListener('change', refresh);
  typeSel.addEventListener('change', refresh);
  if (netSel) netSel.addEventListener('change', refresh);
  if (binInput) {
    binInput.addEventListener('input', () => {
      binInput.value = binInput.value.replace(/\D/g, '').slice(0, 8);
      const net = netSel ? netSel.value : '';
      if (net && binInput.value.length >= 6) localStorage.setItem('bin:' + net, binInput.value);
      if (mockEl) updateMock(mockEl, picker.get());
    });
  }
  const picker = {
    get: () => ({
      bank: bankSel.value,
      cardType: typeSel.value,
      variant: variantCombo.getValue(),
      network: netSel ? netSel.value : '',
      bin: binInput ? binInput.value : ''
    }),
    set: (bank, cardType, variant, network) => {
      bankSel.value = bank; typeSel.value = cardType;
      if (netSel && network !== undefined) netSel.value = network || '';
      refresh();
      variantCombo.setValue(variant);
      if (mockEl) updateMock(mockEl, picker.get());
    }
  };
  refresh();
  return picker;
}

function on(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}

// Persistent chat widget: injected on every page so "Ask FinMitra" is always available,
// without needing to duplicate its markup in every page's HTML.
const NAV_LINKS = [
  { page: 'lookup', href: 'lookup.html', label: 'Look up a card' },
  { page: 'compare', href: 'compare.html', label: 'Compare cards' },
  { page: 'salary', href: 'salary.html', label: 'Salary account' },
  { page: 'quiz', href: 'quiz.html', label: 'Find my card' },
  { page: 'invest', href: 'invest.html', label: 'Investments' },
  { page: 'wallet', href: 'wallet.html', label: 'Optimize my cards' },
  { page: 'saved', href: 'saved.html', label: 'Saved' }
];

function injectNavBar() {
  const currentPage = document.body.dataset.page || '';
  const bar = document.createElement('div');
  bar.className = 'brand-bar';
  bar.innerHTML =
    '<div class="brand-logo">' +
      '<a href="index.html" style="display:flex; align-items:center; gap:10px; text-decoration:none;">' +
        '<div class="brand-mark">' +
          '<svg viewBox="0 0 100 100" width="22" height="22" aria-hidden="true">' +
            '<rect x="32" y="24" width="13" height="54" rx="3" fill="#ffffff"/>' +
            '<rect x="32" y="24" width="40" height="13" rx="3" fill="#ffffff"/>' +
            '<rect x="32" y="47" width="30" height="13" rx="3" fill="#ffffff"/>' +
            '<circle cx="68" cy="30.5" r="10" fill="#F4B740"/>' +
          '</svg>' +
        '</div>' +
        '<div class="brand-name">Fin<span style="color:var(--brand-2);">Mitra</span></div>' +
      '</a>' +
    '</div>' +
    '<nav class="brand-nav">' +
      NAV_LINKS.map(l => '<a href="' + l.href + '" class="' + (l.page === currentPage ? 'active' : '') + '">' + l.label + '</a>').join('') +
    '</nav>' +
    '<div class="brand-actions">' +
      '<button type="button" class="go-pro-btn" id="goProBtn"><i class="ti ti-sparkles"></i>Go Pro</button>' +
    '</div>';
  const wrap = document.querySelector('.wrap');
  if (wrap) { wrap.insertBefore(bar, wrap.firstChild); } else { document.body.insertBefore(bar, document.body.firstChild); }
}
injectNavBar();

function injectChatWidget() {
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.id = 'chatFab';
  fab.setAttribute('aria-label', 'Ask FinMitra a question');
  fab.innerHTML = '<i class="ti ti-message-circle-question"></i>';
  document.body.appendChild(fab);

  const drawer = document.createElement('div');
  drawer.className = 'chat-drawer';
  drawer.id = 'chatDrawer';
  drawer.innerHTML =
    '<div class="chat-drawer-header">' +
      '<div class="chat-header"><i class="ti ti-message-circle-question"></i><h2>Ask FinMitra</h2></div>' +
      '<button type="button" class="chat-drawer-close" id="chatDrawerClose"><i class="ti ti-x"></i></button>' +
    '</div>' +
    '<p class="chat-sub">Something like "which Indian card gives free Coursera access." Searches across all banks, checked against live results, not guessed.</p>' +
    '<div class="chat-suggestions" id="chatSuggestions">' +
      '<button type="button" class="chat-chip">Which card has the best lounge access?</button>' +
      '<button type="button" class="chat-chip">Which card has the lowest forex markup?</button>' +
    '</div>' +
    '<div class="chat-messages" id="chatMessages"></div>' +
    '<div class="chat-input-row">' +
      '<input type="text" id="chatInput" placeholder="Ask about a specific benefit..." />' +
      '<button type="button" id="chatSend"><i class="ti ti-send"></i></button>' +
    '</div>';
  document.body.appendChild(drawer);

  fab.addEventListener('click', () => drawer.classList.toggle('open'));
  document.getElementById('chatDrawerClose').addEventListener('click', () => drawer.classList.remove('open'));
}
injectChatWidget();

// Single-card lookup page: initialize its picker only if that page's markup is present.
const singleRoot = document.querySelector('#panelSingle .picker');
const singlePicker = singleRoot ? initPicker(singleRoot, document.getElementById('mockSingle')) : null;
if (singlePicker) {
  const qp = new URLSearchParams(window.location.search);
  if (qp.get('bank')) {
    singlePicker.set(qp.get('bank'), qp.get('type') || 'Credit Card', qp.get('variant') || '', qp.get('network') || '');
  }
}

let comparePickers = [];
let salaryBankPopulated = false;
const MAX_COMPARE = 4;

// Compare page: start with two cards by default if that page's markup is present.
if (document.getElementById('panelCompare')) { addCompareCard(); addCompareCard(); }

// Salary account page: populate the preferred-bank dropdown if present.
const salaryBankSelect = document.getElementById('salaryPreferredBank');
if (salaryBankSelect && !salaryBankPopulated) {
  banks.forEach(b => { const o = document.createElement('option'); o.value = b; o.textContent = b; salaryBankSelect.appendChild(o); });
  salaryBankPopulated = true;
}

on('investType', 'change', (e) => {
  const isMf = e.target.value === 'Mutual Fund';
  document.getElementById('investFdRdFields').style.display = isMf ? 'none' : 'block';
  document.getElementById('investMfFields').style.display = isMf ? 'block' : 'none';
});

function mockMarkup(prefix) {
  return '<div class="card-mock" id="mock' + prefix + '">' +
    '<div class="card-mock-top"><div class="card-mock-bank" id="mockBank' + prefix + '">Bank</div>' +
    '<div class="card-mock-network" id="mockNetwork' + prefix + '">ANY</div></div>' +
    '<div><div class="card-mock-chip"></div><div class="card-mock-variant" id="mockVariant' + prefix + '">Variant</div></div>' +
    '<div class="card-mock-bottom"><span id="mockType' + prefix + '">Credit card</span><span class="card-mock-dots" id="mockDots' + prefix + '">•••• 1234</span></div></div>';
}

function pickerFieldsMarkup(label, removable) {
  return '<div class="picker-label-row">' + label + '</div>' +
    (removable ? '<button type="button" class="remove-card-btn"><i class="ti ti-x"></i> Remove this card</button>' : '') +
    '<div class="field-group"><label>Bank</label><select class="bank"></select></div>' +
    '<div class="field-group"><label>Card type</label><select class="cardType"><option value="Credit Card">Credit card</option><option value="Debit Card">Debit card</option></select></div>' +
    '<div class="field-group"><label>Network</label><select class="network"></select></div>' +
    '<div class="field-group"><label>Variant</label><div class="variant-combo"><input type="text" class="variant-input" placeholder="Search or type a variant" autocomplete="off"/><div class="variant-dropdown" hidden></div></div></div>' +
    '<button type="button" class="bin-toggle"><i class="ti ti-chevron-down"></i> I have my card handy (optional)</button>' +
    '<div class="bin-field"><label>Your card BIN (first 6-8 digits)</label><input class="bin" type="text" inputmode="numeric" maxlength="8" placeholder="e.g. 123456"/></div>';
}

function renderComparePanel() {
  const panel = document.getElementById('panelCompare');
  const letters = ['A', 'B', 'C', 'D'];
  let html = '';
  comparePickers.forEach((p, i) => {
    html += '<div class="sticky-col" data-compare-idx="' + i + '">' + mockMarkup(letters[i]) + '<div class="picker">' + pickerFieldsMarkup('Card ' + letters[i], comparePickers.length > 2) + '</div></div>';
  });
  if (comparePickers.length < MAX_COMPARE) {
    html += '<div><button type="button" class="add-card-btn" id="addCompareCardBtn"><i class="ti ti-plus"></i>Add another card to compare</button></div>';
  }
  panel.innerHTML = html;
  const cols = panel.querySelectorAll('[data-compare-idx]');
  cols.forEach((col, i) => {
    const pickerEl = col.querySelector('.picker');
    const mockEl = col.querySelector('.card-mock');
    comparePickers[i].instance = initPicker(pickerEl, mockEl);
    const removeBtn = col.querySelector('.remove-card-btn');
    if (removeBtn) removeBtn.addEventListener('click', () => removeCompareCard(i));
  });
  const addBtn = document.getElementById('addCompareCardBtn');
  if (addBtn) addBtn.addEventListener('click', addCompareCard);
}

function addCompareCard() {
  if (comparePickers.length >= MAX_COMPARE) return;
  comparePickers.push({ instance: null });
  renderComparePanel();
}

function removeCompareCard(index) {
  if (comparePickers.length <= 2) return;
  comparePickers.splice(index, 1);
  renderComparePanel();
}

let walletPickers = [];
const MAX_WALLET = 8;

function walletEntryMarkup() {
  return '<button type="button" class="wallet-entry-remove"><i class="ti ti-x"></i></button>' +
    '<div class="field-group"><label>Bank</label><select class="bank"></select></div>' +
    '<div class="field-group"><label>Card type</label><select class="cardType"><option value="Credit Card">Credit card</option><option value="Debit Card">Debit card</option></select></div>' +
    '<div class="field-group"><label>Network</label><select class="network"></select></div>' +
    '<div class="field-group"><label>Variant</label><div class="variant-combo"><input type="text" class="variant-input" placeholder="Search or type" autocomplete="off"/><div class="variant-dropdown" hidden></div></div></div>';
}

function renderWalletEntries() {
  const container = document.getElementById('walletEntries');
  if (!walletPickers.length) {
    container.innerHTML = '<div class="wallet-empty-note">No cards added yet. Add one, or load from your saved cards.</div>';
    return;
  }
  container.innerHTML = walletPickers.map((_, i) => '<div class="wallet-entry" data-wallet-idx="' + i + '">' + walletEntryMarkup() + '</div>').join('');
  const rows = container.querySelectorAll('.wallet-entry');
  rows.forEach((row, i) => {
    walletPickers[i].instance = initPicker(row, null);
    if (walletPickers[i].preset) {
      const p = walletPickers[i].preset;
      walletPickers[i].instance.set(p.bank, p.cardType, p.variant, p.network);
    }
    row.querySelector('.wallet-entry-remove').addEventListener('click', () => removeWalletEntry(i));
  });
}

function addWalletEntry(preset) {
  if (walletPickers.length >= MAX_WALLET) return;
  walletPickers.push({ instance: null, preset: preset || null });
  renderWalletEntries();
}

function removeWalletEntry(index) {
  walletPickers.splice(index, 1);
  renderWalletEntries();
}

// Wallet page: start with one empty entry if that page's markup is present.
if (document.getElementById('panelWallet') && !walletPickers.length) { addWalletEntry(); }

on('addWalletEntry', 'click', () => addWalletEntry());

on('loadSavedToWallet', 'click', () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('card:'));
  if (!keys.length) { alert('No saved cards yet. Save a card from a lookup result first, or add one manually below.'); return; }
  walletPickers = [];
  keys.slice(0, MAX_WALLET).forEach(k => {
    try {
      const card = JSON.parse(localStorage.getItem(k));
      walletPickers.push({ instance: null, preset: card });
    } catch (e) {}
  });
  renderWalletEntries();
});

const sectionMeta = {
  rewards: { label: 'Rewards', icon: 'ti-gift', finePrint: false },
  loungeAccess: { label: 'Lounge access', icon: 'ti-plane', finePrint: false },
  milestoneBenefits: { label: 'Milestone benefits', icon: 'ti-trophy', finePrint: false },
  otherPerks: { label: 'Other perks', icon: 'ti-sparkles', finePrint: false },
  fuelSurcharge: { label: 'Fuel surcharge', icon: 'ti-gas-station', finePrint: true },
  insurance: { label: 'Insurance cover', icon: 'ti-shield-check', finePrint: true },
  forexMarkup: { label: 'Forex markup', icon: 'ti-world', finePrint: true },
  eligibility: { label: 'Eligibility', icon: 'ti-user-check', finePrint: true },
  documentsRequired: { label: 'Documents required', icon: 'ti-file-text', finePrint: true }
};

const API_BASE = '';

// Affiliate monetization hook. Sign up with an Indian affiliate network that carries bank card
// offers (e.g. EarnKaro, INRDeals, vCommission, Cuelinks) and paste your tracking details below.
// When disabled (the default), "Apply for this card" just links to a plain Google search, which
// is what happens until this is configured.
const AFFILIATE_CONFIG = {
  enabled: false,
  wrapUrl: (searchUrl, bank, variant) => searchUrl // return a tracking-wrapped URL here once configured
};

function buildApplyLink(searchUrl, bank, variant) {
  return AFFILIATE_CONFIG.enabled ? AFFILIATE_CONFIG.wrapUrl(searchUrl, bank, variant) : searchUrl;
}

async function lookup(card) {
  const response = await fetch(API_BASE + '/api/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card)
  });
  const data = await response.json();
  if (!response.ok) {
    const message = data.debug ? `${data.error} (${data.debug})` : (data.error || 'Lookup failed');
    const err = new Error(message);
    err.retrySeconds = data.retrySeconds || null;
    throw err;
  }
  return data;
}

function renderError(container, e) {
  if (e.retrySeconds) {
    let remaining = e.retrySeconds;
    container.innerHTML = '<div class="error"><i class="ti ti-alert-triangle"></i><div>' + e.message + ' (<span class="retry-count">' + remaining + '</span>s)</div></div>';
    const span = container.querySelector('.retry-count');
    const timer = setInterval(() => {
      remaining -= 1;
      if (!span.isConnected) { clearInterval(timer); return; }
      if (remaining <= 0) { span.parentElement.textContent = 'You can try again now.'; clearInterval(timer); return; }
      span.textContent = remaining;
    }, 1000);
  } else {
    container.innerHTML = '<div class="error"><i class="ti ti-alert-triangle"></i><div>' + e.message + '</div></div>';
  }
}

function renderCard(parsed, card) {
  const tier = tierFor(card.variant);
  let html = '<div class="card-result">';
  html += '<div class="card-result-header"><span class="card-result-swatch" style="background:' + tierColors[tier] + '"></span><div class="card-title">' + card.bank + '</div></div>';
  html += '<div class="card-sub">' + card.cardType + ' - ' + card.variant + (card.network ? ' (' + card.network + ')' : '') + '</div>';

  // --- Overview tab: the decision-making essentials ---
  let overview = '';
  if (parsed.welcomeBenefit) overview += '<div class="welcome-pill"><i class="ti ti-confetti"></i>' + parsed.welcomeBenefit + '</div>';
  const feeRows = [['Joining','joining'],['Annual','annual'],['Add-on card','addOnCard'],['Late payment','latePayment'],['Interest rate','interestRate']];
  if (card.cardType === 'Debit Card') feeRows.splice(3, 0, ['Cash withdrawal','cashWithdrawal']);
  const feeCells = feeRows.filter(r => (parsed.fees || {})[r[1]] && parsed.fees[r[1]] !== 'Not applicable');
  if (feeCells.length) {
    overview += '<div class="fee-grid">';
    feeCells.forEach(r => {
      overview += '<div class="fee-cell"><div class="fee-label">' + r[0] + '</div><div class="fee-value">' + parsed.fees[r[1]] + '</div></div>';
    });
    overview += '</div>';
  }
  if (parsed.feeWaiverTip && parsed.feeWaiverTip !== 'Not applicable') {
    overview += '<div class="callout"><div class="callout-title"><i class="ti ti-receipt-refund"></i>How to waive the fee</div>' + parsed.feeWaiverTip + '</div>';
    overview += '<div class="fee-tracker-slot" data-tip="' + parsed.feeWaiverTip.replace(/"/g, '&quot;') + '"></div>';
  }
  if (Array.isArray(parsed.maximizeTips) && parsed.maximizeTips.length) {
    overview += '<div class="callout maximize"><div class="callout-title"><i class="ti ti-bulb"></i>Get the most from this card</div><ul>';
    parsed.maximizeTips.forEach(t => { overview += '<li>' + t + '</li>'; });
    overview += '</ul></div>';
  }
  if (!overview) overview = '<p style="color:var(--ink-muted); font-size:14px;">No overview details found for this card.</p>';

  // --- Rewards and perks tab ---
  let rewards = '';
  ['rewards','loungeAccess','milestoneBenefits','otherPerks'].forEach(key => {
    const meta = sectionMeta[key];
    const val = parsed[key];
    const items = Array.isArray(val) ? val : (val ? [val] : []);
    if (!items.length) return;
    rewards += '<div class="section-title"><i class="ti ' + meta.icon + '"></i>' + meta.label + '</div><ul class="benefit-list">';
    items.forEach(it => { rewards += '<li>' + it + '</li>'; });
    rewards += '</ul>';
  });
  const portal = networkPortals[card.network];
  if (Array.isArray(parsed.networkPerks) && parsed.networkPerks.length) {
    rewards += '<div class="callout network"><div class="callout-title"><i class="ti ti-building-bank"></i>' + (card.network || 'Network') + ' perks (beyond what the bank gives)</div><ul>';
    parsed.networkPerks.forEach(t => { rewards += '<li>' + t + '</li>'; });
    rewards += '</ul></div>';
  }
  if (!rewards) rewards = '<p style="color:var(--ink-muted); font-size:14px;">No specific rewards or perks found for this card.</p>';

  // --- Fees and eligibility tab: the fine print ---
  let feesTab = '<div class="fee-grid">';
  const allFeeRows = [['Joining','joining'],['Annual','annual'],['Add-on card','addOnCard'],['Cash withdrawal','cashWithdrawal'],['Late payment','latePayment'],['Interest rate','interestRate']];
  const allFeeCells = allFeeRows.filter(r => (parsed.fees || {})[r[1]] && parsed.fees[r[1]] !== 'Not applicable');
  allFeeCells.forEach(r => {
    feesTab += '<div class="fee-cell"><div class="fee-label">' + r[0] + '</div><div class="fee-value">' + parsed.fees[r[1]] + '</div></div>';
  });
  feesTab += '</div>';
  ['fuelSurcharge','insurance','forexMarkup','eligibility','documentsRequired'].forEach(key => {
    const meta = sectionMeta[key];
    const val = parsed[key];
    const items = Array.isArray(val) ? val : (val ? [val] : []);
    if (!items.length) return;
    feesTab += '<div class="section-title"><i class="ti ' + meta.icon + '"></i>' + meta.label + '</div><ul class="benefit-list">';
    items.forEach(it => { feesTab += '<li>' + it + '</li>'; });
    feesTab += '</ul>';
  });

  html += '<div class="tabs">' +
    '<button type="button" class="tab-btn active" data-tab="overview"><i class="ti ti-layout-dashboard"></i>Overview</button>' +
    '<button type="button" class="tab-btn" data-tab="rewards"><i class="ti ti-gift"></i>Rewards and perks</button>' +
    '<button type="button" class="tab-btn" data-tab="fees"><i class="ti ti-file-invoice"></i>Fees and eligibility</button>' +
    '</div>';
  html += '<div class="tab-panel active" data-panel="overview">' + overview + '</div>';
  html += '<div class="tab-panel" data-panel="rewards">' + rewards + '</div>';
  html += '<div class="tab-panel" data-panel="fees">' + feesTab + '</div>';

  if (parsed.sources && parsed.sources.length) {
    html += '<div class="sources">Sources (links may expire since they route through Google Search): ' + parsed.sources.map(s => {
      const label = s.title || s.url;
      const searchFallback = 'https://www.google.com/search?q=' + encodeURIComponent(s.title || s.url);
      return '<a href="' + s.url + '" target="_blank" rel="noopener">' + label + '</a> (<a href="' + searchFallback + '" target="_blank" rel="noopener">search</a>)';
    }).join(', ') + '</div>';
  }
  if (portal) {
    html += '<div class="portal-link"><i class="ti ti-external-link"></i><a href="' + portal.url + '" target="_blank" rel="noopener">Browse ' + card.network + ' offers</a><span> - ' + portal.note + '</span></div>';
  }
  const applyQuery = encodeURIComponent(card.bank + ' ' + card.variant + ' ' + card.cardType + ' apply online');
  const applyUrl = buildApplyLink('https://www.google.com/search?q=' + applyQuery, card.bank, card.variant);
  html += '<a class="apply-link" href="' + applyUrl + '" target="_blank" rel="noopener"><i class="ti ti-external-link"></i>Apply for this card</a>';
  html += '<button class="save-btn" data-bank="' + card.bank + '" data-type="' + card.cardType + '" data-variant="' + card.variant + '"><i class="ti ti-bookmark"></i>Save this card</button>';
  html += '</div>';
  return html;
}

function wireTabs(root) {
  root.querySelectorAll('.card-result').forEach(cardEl => {
    const btns = cardEl.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cardEl.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const target = cardEl.querySelector('.tab-panel[data-panel="' + btn.dataset.tab + '"]');
        if (target) target.classList.add('active');
      });
    });
  });
}

function wireFeeTracker(root, card, index) {
  const all = root.querySelectorAll('.card-result');
  const cardEl = typeof index === 'number' ? all[index] : all[0];
  if (!cardEl) return;
  const slot = cardEl.querySelector('.fee-tracker-slot');
  if (!slot) return;
  const tipText = slot.dataset.tip || '';
  const match = tipText.match(/₹\s?([\d,]+(?:\.\d+)?)/);
  if (!match) return;
  const target = parseFloat(match[1].replace(/,/g, ''));
  if (!target || target <= 0) return;
  const key = 'feeSpend:' + card.bank + '|' + card.cardType + '|' + card.variant;
  const saved = parseFloat(localStorage.getItem(key) || '0');

  function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

  slot.innerHTML =
    '<div class="fee-tracker">' +
    '<div class="fee-tracker-label"><span>Spend progress toward waiver</span><span class="fee-progress-text">' + fmt(saved) + ' / ' + fmt(target) + '</span></div>' +
    '<div class="fee-tracker-bar"><div class="fee-tracker-fill' + (saved >= target ? ' done' : '') + '" style="width:' + Math.min(100, (saved / target) * 100) + '%"></div></div>' +
    '<input type="number" class="fee-spend-input" placeholder="How much have you spent so far this year?" value="' + (saved || '') + '" />' +
    '<div class="fee-tracker-note">Target estimated from the tip above. Saved on this device only, not sent anywhere.</div>' +
    '</div>';

  const input = slot.querySelector('.fee-spend-input');
  input.addEventListener('change', () => {
    const val = Math.max(0, parseFloat(input.value) || 0);
    localStorage.setItem(key, String(val));
    const fill = slot.querySelector('.fee-tracker-fill');
    const pct = Math.min(100, (val / target) * 100);
    fill.style.width = pct + '%';
    fill.classList.toggle('done', val >= target);
    slot.querySelector('.fee-progress-text').textContent = fmt(val) + ' / ' + fmt(target);
  });
}

function extractRupees(str) {
  if (!str) return null;
  const match = String(str).match(/₹\s?([\d,]+(?:\.\d+)?)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : null;
}
function extractPercent(str) {
  if (!str) return null;
  const match = String(str).match(/([\d.]+)\s?%/);
  return match ? parseFloat(match[1]) : null;
}

function renderComparisonChart(parsedList, cards) {
  const annualValues = parsedList.map(p => extractRupees(p.fees && p.fees.annual));
  const forexValues = parsedList.map(p => extractPercent(p.forexMarkup));
  const hasAnnual = annualValues.some(v => v !== null);
  const hasForex = forexValues.some(v => v !== null);
  if (!hasAnnual && !hasForex) return '';

  function barsFor(values, unit, colorVar) {
    const max = Math.max(...values.filter(v => v !== null), 1);
    return values.map((v, i) => {
      const name = cards[i].bank + ' ' + cards[i].variant;
      if (v === null) {
        return '<div class="chart-bar-item"><div class="chart-bar-name" title="' + name + '">' + name + '</div><div class="chart-bar-track"></div><div class="chart-bar-value">n/a</div></div>';
      }
      const pct = (v / max) * 100;
      const valueLabel = unit === '%' ? v + '%' : '₹' + Math.round(v).toLocaleString('en-IN');
      return '<div class="chart-bar-item"><div class="chart-bar-name" title="' + name + '">' + name + '</div>' +
        '<div class="chart-bar-track"><div class="chart-bar-fill" style="width:' + pct + '%; background:var(' + colorVar + ')"></div></div>' +
        '<div class="chart-bar-value">' + valueLabel + '</div></div>';
    }).join('');
  }

  let html = '<div class="chart-wrap"><div class="chart-title">Quick visual comparison</div>';
  if (hasAnnual) {
    html += '<div class="chart-row"><div class="chart-row-label">Annual fee (lower is better)</div><div class="chart-bars">' + barsFor(annualValues, '₹', '--teal') + '</div></div>';
  }
  if (hasForex) {
    html += '<div class="chart-row"><div class="chart-row-label">Forex markup (lower is better)</div><div class="chart-bars">' + barsFor(forexValues, '%', '--brass') + '</div></div>';
  }
  html += '</div>';
  return html;
}

function renderExportRow(parsedList, cards) {
  return '<div class="export-row" id="compareExportRow">' +
    '<button type="button" class="export-btn" id="copyComparisonBtn"><i class="ti ti-copy"></i>Copy comparison summary</button>' +
    '<button type="button" class="export-btn" id="downloadComparisonBtn"><i class="ti ti-download"></i>Download as text file</button>' +
    '</div>';
}

function buildComparisonText(parsedList, cards) {
  let text = 'Card benefits comparison\n' + new Date().toLocaleDateString('en-IN') + '\n\n';
  parsedList.forEach((p, i) => {
    const c = cards[i];
    text += '=== ' + c.bank + ' - ' + c.variant + (c.network ? ' (' + c.network + ')' : '') + ' ===\n';
    text += c.cardType + '\n';
    if (p.fees) {
      Object.entries(p.fees).forEach(([k, v]) => { if (v && v !== 'Not applicable') text += '  ' + k + ': ' + v + '\n'; });
    }
    if (p.feeWaiverTip) text += '  Fee waiver: ' + p.feeWaiverTip + '\n';
    ['rewards', 'loungeAccess', 'milestoneBenefits', 'otherPerks'].forEach(k => {
      const items = Array.isArray(p[k]) ? p[k] : [];
      if (items.length) text += '  ' + k + ': ' + items.join('; ') + '\n';
    });
    text += '\n';
  });
  return text;
}

function wireExportButtons(parsedList, cards) {
  const copyBtn = document.getElementById('copyComparisonBtn');
  const downloadBtn = document.getElementById('downloadComparisonBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = buildComparisonText(parsedList, cards);
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="ti ti-check"></i>Copied';
        setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
      } catch (e) {}
    });
  }
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const text = buildComparisonText(parsedList, cards);
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'card-comparison.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

function saveCard(card) {
  const key = 'card:' + card.bank + '|' + card.cardType + '|' + card.variant;
  localStorage.setItem(key, JSON.stringify(card));
  loadSaved();
}

function loadSaved() {
  const list = document.getElementById('savedList');
  if (!list) return;
  const keys = Object.keys(localStorage).filter(k => k.startsWith('card:'));
  if (!keys.length) { list.innerHTML = '<span class="saved-empty">None yet. Look up a card and save it.</span>'; return; }
  list.innerHTML = '';
  keys.forEach(k => {
    const card = JSON.parse(localStorage.getItem(k));
    const chip = document.createElement('button');
    chip.className = 'saved-chip';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = tierColors[tierFor(card.variant)];
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode(card.bank + ' - ' + card.variant + (card.network ? ' (' + card.network + ')' : '')));
    chip.addEventListener('click', () => {
      const params = new URLSearchParams({ bank: card.bank, type: card.cardType, variant: card.variant, network: card.network || '' });
      window.location.href = 'lookup.html?' + params.toString();
    });
    list.appendChild(chip);
  });
}
loadSaved();

on('exportSavedBtn', 'click', () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('card:'));
  const cards = keys.map(k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }).filter(Boolean);
  if (!cards.length) return;
  let text = 'My saved cards\n' + new Date().toLocaleDateString('en-IN') + '\n\n';
  cards.forEach(c => {
    text += '- ' + c.bank + ' ' + c.cardType + ' - ' + c.variant + (c.network ? ' (' + c.network + ')' : '') + '\n';
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-saved-cards.txt';
  a.click();
  URL.revokeObjectURL(url);
});

function renderPortalGrid() {
  const grid = document.getElementById('portalGrid');
  if (!grid) return;
  grid.innerHTML = Object.keys(networkPortals).map(net => {
    const p = networkPortals[net];
    const safeId = 'bin-' + net.replace(/\s+/g, '');
    const saved = localStorage.getItem('bin:' + net) || '';
    return '<div class="portal-card" style="border-left-color:' + (networkColors[net] || networkColors['']) + '">' +
      '<a href="' + p.url + '" target="_blank" rel="noopener"><div class="portal-name">' + net + '<i class="ti ti-external-link"></i></div><div class="portal-note">' + p.note + '</div></a>' +
      '<div class="bin-row">' +
      '<input type="text" inputmode="numeric" maxlength="8" placeholder="Your card BIN (first 6-8 digits)" value="' + saved + '" id="' + safeId + '" />' +
      '<button type="button" data-net="' + net + '" class="bin-save">Save</button>' +
      '<button type="button" data-net="' + net + '" class="bin-copy">Copy</button>' +
      '</div><div class="bin-saved-note" id="' + safeId + '-note">' + (saved ? 'Saved on this device' : '') + '</div>' +
      '</div>';
  }).join('');

  grid.querySelectorAll('.bin-save').forEach(btn => {
    btn.addEventListener('click', () => {
      const net = btn.dataset.net;
      const input = document.getElementById('bin-' + net.replace(/\s+/g, ''));
      const note = document.getElementById('bin-' + net.replace(/\s+/g, '') + '-note');
      const digits = input.value.replace(/\D/g, '').slice(0, 8);
      input.value = digits;
      if (digits.length >= 6) {
        localStorage.setItem('bin:' + net, digits);
        note.textContent = 'Saved on this device';
      } else {
        note.textContent = 'Needs at least 6 digits';
      }
    });
  });
  grid.querySelectorAll('.bin-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const net = btn.dataset.net;
      const input = document.getElementById('bin-' + net.replace(/\s+/g, ''));
      if (!input.value) return;
      try {
        await navigator.clipboard.writeText(input.value);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 1200);
      } catch (e) {}
    });
  });
}
renderPortalGrid();

const LOADING_STEPS = ['Checking the bank\'s official page...', 'Verifying fees and eligibility...', 'Checking network-specific perks...', 'Putting it all together...'];

function startStepLoader(container, count) {
  count = count || 1;
  const ids = [];
  let html = '';
  for (let i = 0; i < count; i++) {
    const id = 'loader-' + Math.random().toString(36).slice(2);
    ids.push(id);
    html += '<div class="status" id="' + id + '"><div class="spinner"></div>' + LOADING_STEPS[0] + '</div>';
  }
  container.innerHTML = html;
  let step = 0;
  const timer = setInterval(() => {
    step = (step + 1) % LOADING_STEPS.length;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.lastChild.textContent = LOADING_STEPS[step];
    });
  }, 1400);
  return () => clearInterval(timer);
}

on('goSingle', 'click', async () => {
  const card = singlePicker.get();
  const results = document.getElementById('resultsSingle');
  const stopLoader = startStepLoader(results, 1);
  try {
    const parsed = await lookup(card);
    stopLoader();
    results.innerHTML = renderCard(parsed, card);
    results.querySelector('.save-btn').addEventListener('click', () => saveCard(card));
    wireTabs(results);
    wireFeeTracker(results, card);
  } catch (e) {
    stopLoader();
    renderError(results, e);
  }
});

on('goCompare', 'click', async () => {
  const cards = comparePickers.map(p => p.instance.get());
  const results = document.getElementById('resultsCompare');
  const chartContainer = document.getElementById('chartContainer');
  chartContainer.innerHTML = '';
  const stopLoader = startStepLoader(results, cards.length);
  try {
    const parsedList = await Promise.all(cards.map(c => lookup(c)));
    stopLoader();
    results.innerHTML = parsedList.map((p, i) => renderCard(p, cards[i])).join('');
    const btns = results.querySelectorAll('.save-btn');
    btns.forEach((btn, i) => btn.addEventListener('click', () => saveCard(cards[i])));
    wireTabs(results);
    parsedList.forEach((p, i) => wireFeeTracker(results, cards[i], i));
    chartContainer.innerHTML = renderComparisonChart(parsedList, cards);
    results.insertAdjacentHTML('afterend', renderExportRow(parsedList, cards));
    wireExportButtons(parsedList, cards);
  } catch (e) {
    stopLoader();
    renderError(results, e);
  }
});

let chatHistory = [];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function appendChatBubble(role, html, id) {
  const messages = document.getElementById('chatMessages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-msg ' + role;
  if (id) bubble.id = id;
  bubble.innerHTML = html;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

async function sendChatMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  input.value = '';
  sendBtn.disabled = true;

  appendChatBubble('user', escapeHtml(trimmed));
  const loadingBubble = appendChatBubble('assistant loading', '<div class="spinner" style="width:16px;height:16px;"></div>Checking current sources...');

  try {
    const response = await fetch(API_BASE + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: trimmed,
        history: chatHistory
      })
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data.retrySeconds ? `${data.error} (wait ~${data.retrySeconds}s)` : (data.error || 'Could not get an answer.');
      loadingBubble.className = 'chat-msg error-msg';
      loadingBubble.innerHTML = '<i class="ti ti-alert-triangle"></i> ' + escapeHtml(message);
      sendBtn.disabled = false;
      return;
    }
    let html = escapeHtml(data.answer).replace(/\n/g, '<br>');
    if (data.sources && data.sources.length) {
      html += '<div class="chat-sources">Sources: ' + data.sources.map(s => {
        const label = escapeHtml(s.title || s.url);
        const searchFallback = 'https://www.google.com/search?q=' + encodeURIComponent(s.title || s.url);
        return '<a href="' + s.url + '" target="_blank" rel="noopener">' + label + '</a> (<a href="' + searchFallback + '" target="_blank" rel="noopener">search</a>)';
      }).join(', ') + '</div>';
    }
    loadingBubble.className = 'chat-msg assistant';
    loadingBubble.innerHTML = html;
    chatHistory.push({ role: 'user', text: trimmed });
    chatHistory.push({ role: 'assistant', text: data.answer });
  } catch (e) {
    loadingBubble.className = 'chat-msg error-msg';
    loadingBubble.innerHTML = '<i class="ti ti-alert-triangle"></i> Something went wrong. Try again.';
  }
  sendBtn.disabled = false;
}

on('chatSend', 'click', () => {
  sendChatMessage(document.getElementById('chatInput').value);
});
on('chatInput', 'keydown', (e) => {
  if (e.key === 'Enter') sendChatMessage(document.getElementById('chatInput').value);
});
const chatSuggestionsEl = document.getElementById('chatSuggestions');
if (chatSuggestionsEl) {
  chatSuggestionsEl.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => sendChatMessage(chip.textContent));
  });
}

function renderSalaryAccounts(parsed) {
  let html = '<div class="salary-results">';
  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  if (!recs.length) {
    html += '<p style="color:var(--ink-muted); font-size:14px;">No confident recommendations found for this salary range. Try a different range or bank.</p>';
  }
  recs.forEach((r, i) => {
    html += '<div class="salary-account-card">';
    html += '<div class="salary-account-title-row"><span class="salary-account-rank">' + (i + 1) + '</span><span class="salary-account-name">' + (r.accountName || 'Account') + '</span></div>';
    html += '<div class="salary-account-bank">' + (r.bank || '') + '</div>';
    if (r.minSalaryRequirement) {
      html += '<div class="salary-min"><b>Minimum salary:</b> ' + r.minSalaryRequirement + '</div>';
    }
    if (r.whyThisFits) {
      html += '<div class="salary-why">' + r.whyThisFits + '</div>';
    }
    const benefits = Array.isArray(r.keyBenefits) ? r.keyBenefits : [];
    if (benefits.length) {
      html += '<ul class="salary-benefits">';
      benefits.forEach(b => { html += '<li>' + b + '</li>'; });
      html += '</ul>';
    }
    if (r.debitCardVariant) {
      html += '<div class="salary-debit"><i class="ti ti-credit-card" style="font-size:13px;vertical-align:-2px;"></i> Debit card: ' + r.debitCardVariant + '</div>';
    }
    html += '</div>';
  });
  if (Array.isArray(parsed.generalTips) && parsed.generalTips.length) {
    html += '<div class="salary-tips"><div class="callout-title"><i class="ti ti-bulb"></i>General tips</div><ul>';
    parsed.generalTips.forEach(t => { html += '<li>' + t + '</li>'; });
    html += '</ul></div>';
  }
  if (parsed.sources && parsed.sources.length) {
    html += '<div class="sources">Sources (links may expire since they route through Google Search): ' + parsed.sources.map(s => {
      const label = s.title || s.url;
      const searchFallback = 'https://www.google.com/search?q=' + encodeURIComponent(s.title || s.url);
      return '<a href="' + s.url + '" target="_blank" rel="noopener">' + label + '</a> (<a href="' + searchFallback + '" target="_blank" rel="noopener">search</a>)';
    }).join(', ') + '</div>';
  }
  html += '</div>';
  return html;
}

on('goSalary', 'click', async () => {
  const salaryRange = document.getElementById('salaryRange').value;
  const preferredBank = document.getElementById('salaryPreferredBank').value;
  const results = document.getElementById('resultsSalary');
  const stopLoader = startStepLoader(results, 1);
  try {
    const response = await fetch(API_BASE + '/api/salary-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salaryRange, preferredBank })
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.debug ? `${data.error} (${data.debug})` : (data.error || 'Lookup failed'));
      err.retrySeconds = data.retrySeconds || null;
      throw err;
    }
    stopLoader();
    results.innerHTML = renderSalaryAccounts(data);
  } catch (e) {
    stopLoader();
    renderError(results, e);
  }
});

function renderQuizResults(parsed) {
  let html = '<div class="salary-results">';
  const recs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  if (!recs.length) {
    html += '<p style="color:var(--ink-muted); font-size:14px;">No confident matches found. Try adjusting your answers.</p>';
  }
  recs.forEach((r, i) => {
    html += '<div class="salary-account-card">';
    html += '<div class="salary-account-title-row"><span class="salary-account-rank">' + (i + 1) + '</span><span class="salary-account-name">' + (r.cardName || 'Card') + '</span></div>';
    html += '<div class="salary-account-bank">' + (r.bank || '') + (r.network ? ' - ' + r.network : '') + '</div>';
    if (r.annualFee) html += '<div class="salary-min"><b>Annual fee:</b> ' + r.annualFee + '</div>';
    if (r.whyThisFits) html += '<div class="salary-why">' + r.whyThisFits + '</div>';
    const perks = Array.isArray(r.keyPerks) ? r.keyPerks : [];
    if (perks.length) {
      html += '<ul class="salary-benefits">';
      perks.forEach(p => { html += '<li>' + p + '</li>'; });
      html += '</ul>';
    }
    html += '</div>';
  });
  if (parsed.sources && parsed.sources.length) {
    html += '<div class="sources">Sources (links may expire since they route through Google Search): ' + parsed.sources.map(s => {
      const label = s.title || s.url;
      const searchFallback = 'https://www.google.com/search?q=' + encodeURIComponent(s.title || s.url);
      return '<a href="' + s.url + '" target="_blank" rel="noopener">' + label + '</a> (<a href="' + searchFallback + '" target="_blank" rel="noopener">search</a>)';
    }).join(', ') + '</div>';
  }
  html += '</div>';
  return html;
}

on('goQuiz', 'click', async () => {
  const spendCategory = document.getElementById('quizSpendCategory').value;
  const spendAmount = document.getElementById('quizSpendAmount').value;
  const wantsLounge = document.getElementById('quizLounge').value;
  const preferredNetwork = document.getElementById('quizNetwork').value;
  const results = document.getElementById('resultsQuiz');
  const stopLoader = startStepLoader(results, 1);
  try {
    const response = await fetch(API_BASE + '/api/recommend-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spendCategory, spendAmount, wantsLounge, preferredNetwork })
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.debug ? `${data.error} (${data.debug})` : (data.error || 'Lookup failed'));
      err.retrySeconds = data.retrySeconds || null;
      throw err;
    }
    stopLoader();
    results.innerHTML = renderQuizResults(data);
  } catch (e) {
    stopLoader();
    renderError(results, e);
  }
});

function riskBadgeClass(riskLevel) {
  const s = (riskLevel || '').toLowerCase();
  if (s.startsWith('very low') || s.startsWith('low')) return 'low';
  if (s.startsWith('high')) return 'high';
  return 'medium';
}

function renderInvestmentResults(parsed) {
  let html = '';
  const cls = riskBadgeClass(parsed.riskLevel);
  const riskIcon = cls === 'low' ? 'ti-shield-check' : cls === 'high' ? 'ti-alert-triangle' : 'ti-info-circle';
  html += '<div class="risk-badge ' + cls + '"><i class="ti ' + riskIcon + '"></i>Risk level: ' + (parsed.riskLevel || 'Not specified') + '</div>';

  if (parsed.categoryOverview) {
    html += '<p style="font-size:14px; color:var(--ink); line-height:1.6; margin-bottom:14px;">' + parsed.categoryOverview + '</p>';
  }
  if (parsed.historicalReturnRange) {
    html += '<div class="callout"><div class="callout-title"><i class="ti ti-history"></i>Historical category average (not a guarantee)</div>' + parsed.historicalReturnRange + '</div>';
  }

  const comparison = Array.isArray(parsed.comparison) ? parsed.comparison : [];
  if (comparison.length) {
    const isMf = parsed.investmentType === 'Mutual Fund';
    html += '<table class="invest-table"><thead><tr>';
    if (isMf) {
      html += '<th>Fund category</th><th>Typical risk</th><th>What it invests in</th>';
    } else {
      html += '<th>Bank</th><th>Product</th><th>Interest rate (p.a.)</th><th>Annualized yield</th><th>Tenure</th>';
    }
    html += '</tr></thead><tbody>';
    comparison.forEach(row => {
      if (isMf) {
        html += '<tr><td>' + (row.fundCategory || '') + '</td><td>' + (row.typicalRiskLevel || '') + '</td><td>' + (row.whatItInvestsIn || '') + '</td></tr>';
      } else {
        html += '<tr><td>' + (row.bank || '') + (row.slabNote ? '<div style="font-size:11px; color:var(--ink-muted); margin-top:2px;">' + row.slabNote + '</div>' : '') + '</td><td>' + (row.productName || '') + '</td><td class="rate-cell">' + (row.interestRate || '') + '</td><td class="rate-cell">' + (row.annualizedYield || '-') + '</td><td>' + (row.tenure || '') + '</td></tr>';
      }
    });
    html += '</tbody></table>';
  }

  if (Array.isArray(parsed.generalNotes) && parsed.generalNotes.length) {
    html += '<div class="callout maximize"><div class="callout-title"><i class="ti ti-notes"></i>Worth knowing</div><ul>';
    parsed.generalNotes.forEach(n => { html += '<li>' + n + '</li>'; });
    html += '</ul></div>';
  }

  if (parsed.sources && parsed.sources.length) {
    html += '<div class="sources">Sources (links may expire since they route through Google Search): ' + parsed.sources.map(s => {
      const label = s.title || s.url;
      const searchFallback = 'https://www.google.com/search?q=' + encodeURIComponent(s.title || s.url);
      return '<a href="' + s.url + '" target="_blank" rel="noopener">' + label + '</a> (<a href="' + searchFallback + '" target="_blank" rel="noopener">search</a>)';
    }).join(', ') + '</div>';
  }

  if (parsed.disclaimer) {
    html += '<div class="invest-disclaimer"><div class="invest-disclaimer-title"><i class="ti ti-alert-circle"></i>Important</div>' + parsed.disclaimer + '</div>';
  }
  return html;
}

on('goInvest', 'click', async () => {
  const investmentType = document.getElementById('investType').value;
  const results = document.getElementById('resultsInvest');
  const stopLoader = startStepLoader(results, 1);
  const body = { investmentType };
  if (investmentType === 'Mutual Fund') {
    body.riskAppetite = document.getElementById('investRisk').value;
    body.horizon = document.getElementById('investHorizon').value;
  } else {
    body.tenure = document.getElementById('investTenure').value;
    body.seniorCitizen = document.getElementById('investSenior').checked;
  }
  try {
    const response = await fetch(API_BASE + '/api/compare-investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.debug ? `${data.error} (${data.debug})` : (data.error || 'Lookup failed'));
      err.retrySeconds = data.retrySeconds || null;
      throw err;
    }
    stopLoader();
    results.innerHTML = renderInvestmentResults(data);
  } catch (e) {
    stopLoader();
    renderError(results, e);
  }
});

function renderWalletResults(parsed) {
  let html = '';

  const strategy = Array.isArray(parsed.categoryStrategy) ? parsed.categoryStrategy : [];
  if (strategy.length) {
    html += '<div class="section-title"><i class="ti ti-target-arrow"></i>Best card for each spend category</div>';
    html += '<table class="strategy-table"><thead><tr><th>Category</th><th>Best card</th><th>Why</th></tr></thead><tbody>';
    strategy.forEach(row => {
      html += '<tr><td class="category-cell">' + (row.category || '') + '</td><td class="card-cell">' + (row.bestCard || '') + '</td><td>' + (row.why || '') + '</td></tr>';
    });
    html += '</tbody></table>';
  }

  const perCard = Array.isArray(parsed.perCard) ? parsed.perCard : [];
  if (perCard.length) {
    html += '<div class="section-title"><i class="ti ti-credit-card"></i>Getting the most from each card</div>';
    perCard.forEach(c => {
      html += '<div class="per-card-block"><div class="card-name">' + (c.bank || '') + ' - ' + (c.variant || '') + '</div>';
      const tips = Array.isArray(c.topTips) ? c.topTips : [];
      if (tips.length) {
        html += '<ul>';
        tips.forEach(t => { html += '<li>' + t + '</li>'; });
        html += '</ul>';
      }
      html += '</div>';
    });
  }

  if (Array.isArray(parsed.walletNotes) && parsed.walletNotes.length) {
    html += '<div class="callout maximize"><div class="callout-title"><i class="ti ti-bulb"></i>Worth fixing in your current setup</div><ul>';
    parsed.walletNotes.forEach(n => { html += '<li>' + n + '</li>'; });
    html += '</ul></div>';
  }

  if (parsed.sources && parsed.sources.length) {
    html += '<div class="sources">Sources (links may expire since they route through Google Search): ' + parsed.sources.map(s => {
      const label = s.title || s.url;
      const searchFallback = 'https://www.google.com/search?q=' + encodeURIComponent(s.title || s.url);
      return '<a href="' + s.url + '" target="_blank" rel="noopener">' + label + '</a> (<a href="' + searchFallback + '" target="_blank" rel="noopener">search</a>)';
    }).join(', ') + '</div>';
  }

  return html || '<p style="color:var(--ink-muted); font-size:14px;">No confident recommendations found. Try adjusting the cards listed.</p>';
}

on('goWallet', 'click', async () => {
  if (!walletPickers.length) { alert('Add at least one card or account first.'); return; }
  const cards = walletPickers.map(p => p.instance.get());
  const results = document.getElementById('resultsWallet');
  const stopLoader = startStepLoader(results, 1);
  try {
    const response = await fetch(API_BASE + '/api/optimize-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards })
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.debug ? `${data.error} (${data.debug})` : (data.error || 'Lookup failed'));
      err.retrySeconds = data.retrySeconds || null;
      throw err;
    }
    stopLoader();
    results.innerHTML = renderWalletResults(data);
  } catch (e) {
    stopLoader();
    renderError(results, e);
  }
});

function applyProStatus(isPro) {
  document.querySelectorAll('.ad-slot').forEach(el => { el.style.display = isPro ? 'none' : 'flex'; });
  const statusEl = document.getElementById('proStatus');
  if (isPro) {
    if (statusEl) statusEl.innerHTML = '<span class="pro-badge"><i class="ti ti-check"></i>Pro active</span> Ads are hidden on this device.';
    if (document.querySelector('.brand-name') && !document.querySelector('.brand-name .pro-badge')) {
      document.querySelector('.brand-name').insertAdjacentHTML('beforeend', '<span class="pro-badge"><i class="ti ti-sparkles"></i>PRO</span>');
    }
  } else {
    if (statusEl) statusEl.textContent = '';
  }
}
applyProStatus(localStorage.getItem('finmitra-pro') === 'true');

on('goProBtn', 'click', () => {
  const section = document.getElementById('proSection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    window.location.href = 'pro.html';
  }
});
on('goProTierBtn', 'click', () => {
  const scriptTag = document.querySelector('#razorpayForm script');
  if (scriptTag && scriptTag.dataset.payment_button_id === 'REPLACE_WITH_YOUR_RAZORPAY_BUTTON_ID') {
    alert('The site owner has not configured a Razorpay Payment Button yet. See DEPLOYMENT.md.');
    return;
  }
  const btn = document.querySelector('#razorpayForm .razorpay-payment-button');
  if (btn) btn.click();
});

on('proCodeRedeem', 'click', async () => {
  const code = document.getElementById('proCodeInput').value.trim();
  const statusEl = document.getElementById('proStatus');
  if (!code) return;
  statusEl.textContent = 'Checking...';
  try {
    const response = await fetch(API_BASE + '/api/redeem-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await response.json();
    if (response.ok && data.valid) {
      localStorage.setItem('finmitra-pro', 'true');
      applyProStatus(true);
    } else {
      statusEl.textContent = data.error || 'That code was not recognized.';
    }
  } catch (e) {
    statusEl.textContent = 'Could not verify the code right now. Try again.';
  }
});
