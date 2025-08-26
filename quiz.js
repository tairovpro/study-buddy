(function(){
  const steps = Array.from(document.querySelectorAll('.step'));
  const progressBar = document.getElementById('progressBar');
  const resultsEl = document.getElementById('results');
  const planSummary = document.getElementById('planSummary');
  const pillbox = document.getElementById('pillbox');
  const weeklyPlan = document.getElementById('weeklyPlan');

  let current = 0;

  function updateProgress(){
    if(!progressBar) return;
    const pct = Math.round(((current+1) / steps.length) * 100);
    progressBar.style.width = pct + '%';
  }

  function showStep(i){
    steps.forEach(s => s.classList.remove('active'));
    steps[i].classList.add('active');
    updateProgress();
  }

  document.getElementById('next1')?.addEventListener('click', ()=>{
    if(!document.querySelector('input[name="goal"]:checked')) return alert('Select a goal!');
    current = 1; showStep(current);
  });

  document.getElementById('next2')?.addEventListener('click', ()=>{
    if(document.querySelectorAll('input[name="subjects"]:checked').length === 0) return alert('Pick at least one subject!');
    current = 2; showStep(current);
  });

  document.getElementById('next3')?.addEventListener('click', ()=>{
    if(!document.querySelector('input[name="time"]:checked') || !document.querySelector('input[name="schedule"]:checked')) return alert('Pick time & schedule!');
    current = 3; showStep(current);
  });

  document.querySelectorAll('[data-back]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      current = Math.max(0, current-1);
      showStep(current);
    });
  });

  function makePlan(){
    const goal = document.querySelector('input[name="goal"]:checked')?.value;
    const subjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(x=>x.value);
    const time = document.querySelector('input[name="time"]:checked')?.value;
    const schedule = document.querySelector('input[name="schedule"]:checked')?.value;
    const style = document.querySelector('input[name="style"]:checked')?.value;
    const level = document.querySelector('input[name="level"]:checked')?.value;

    const dailyMinutes = (/30/.test(time) ? 30 : /1 hour/.test(time) ? 60 : /2 hours/.test(time) ? 120 : 45);
    const focusBlock = style === 'Practice' || style === 'Projects' ? 'hands-on practice' : (style || 'mixed');

    planSummary.textContent = `Goal: ${goal}. Study ~${dailyMinutes} min/day in the ${schedule}. Focus on ${focusBlock}.`;

    pillbox.innerHTML = '';
    [goal,time,schedule,style,level].forEach(t=>{
      if(t){
        const span = document.createElement('span');
        span.className = 'pill';
        span.textContent = t;
        pillbox.appendChild(span);
      }
    });

    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const perSubject = Math.max(1, Math.floor(days.length / (subjects.length || 1)));
    let idx = 0;
    const ul = document.createElement('ul');
    days.forEach(d=>{
      const li = document.createElement('li');
      const subject = subjects.length ? subjects[Math.floor(idx / perSubject) % subjects.length] : 'General Study';
      li.textContent = `${d}: ${subject} • ${dailyMinutes} min • ${focusBlock}`;
      ul.appendChild(li);
      idx++;
    });
    weeklyPlan.innerHTML = '';
    weeklyPlan.appendChild(ul);
  }

  document.getElementById('finish')?.addEventListener('click', ()=>{
    if(!document.querySelector('input[name="style"]:checked') || !document.querySelector('input[name="level"]:checked')) return alert('Pick style & level!');
    makePlan();
    steps.forEach(s=>s.classList.remove('active'));
    resultsEl.style.display = 'block';
    updateProgress();
  });

  showStep(current);
})();