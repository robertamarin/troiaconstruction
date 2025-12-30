(function () {
  const ready = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');

    if (!toggle || !nav) {
      return;
    }

    const body = document.body;
    const openClass = 'nav-open';
    const mobileQuery = window.matchMedia('(max-width: 820px)');

    const setExpanded = (expanded) => {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      if (expanded) {
        body.classList.add(openClass);
      } else {
        body.classList.remove(openClass);
      }

      if (mobileQuery.matches) {
        nav.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      } else {
        nav.removeAttribute('aria-hidden');
      }
    };

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!isExpanded);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setExpanded(false));
    });

    document.addEventListener('click', (event) => {
      if (!body.classList.contains(openClass)) {
        return;
      }

      if (event.target.closest('.site-nav') || event.target.closest('.nav-toggle')) {
        return;
      }

      setExpanded(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    });

    const handleChange = () => setExpanded(false);

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleChange);
    }

    setExpanded(false);

    const callButtons = document.querySelectorAll('.btn-call-now');

    callButtons.forEach((button) => {
      const targetSelector = button.getAttribute('data-target');

      if (!targetSelector) {
        return;
      }

      const target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      const phoneLink = target.querySelector('a');

      button.addEventListener('click', () => {
        const wasHidden = target.hasAttribute('hidden');

        if (wasHidden) {
          target.removeAttribute('hidden');
          button.setAttribute('aria-expanded', 'true');
        }

        if (phoneLink) {
          if (typeof phoneLink.focus === 'function') {
            try {
              phoneLink.focus({ preventScroll: true });
            } catch (error) {
              phoneLink.focus();
            }
          }

          const clickLink = () => {
            if (typeof phoneLink.click === 'function') {
              phoneLink.click();
              return true;
            }

            const href = phoneLink.getAttribute('href');

            if (href) {
              window.location.href = href;
              return true;
            }

            return false;
          };

          if (wasHidden) {
            requestAnimationFrame(() => {
              clickLink();
            });
          } else {
            clickLink();
          }
        }
      });
    });

    const operationsSection = document.querySelector('.operations-section');

    if (operationsSection) {
      const statWeekActions = document.getElementById('stat-week-actions');
      const statWeekDelta = document.getElementById('stat-week-delta');
      const statCompleteCount = document.getElementById('stat-complete-count');
      const statCompletePercent = document.getElementById('stat-complete-percent');
      const statCycleTime = document.getElementById('stat-cycle-time');
      const statActionsToday = document.getElementById('stat-actions-today');
      const statCompletionRate = document.getElementById('stat-completion-rate');
      const statOnTime = document.getElementById('stat-on-time');
      const statQuality = document.getElementById('stat-quality');
      const statResponse = document.getElementById('stat-response');
      const progressOnTime = document.getElementById('progress-on-time');
      const progressQuality = document.getElementById('progress-quality');
      const progressResponse = document.getElementById('progress-response');
      const actionGrid = document.getElementById('action-grid');
      const taskList = document.getElementById('task-list');

      const operations = {
        weeks: [14, 18, 22, 31, 24, 28, 32, 41, 36, 38, 34, 46],
        lastWeek: 34,
        actionsToday: 7,
        cycleTime: '3.8 days',
        onTime: 92,
        quality: 9.4,
        response: '1h 18m',
      };

      const tasks = [
        { title: 'Foundation inspection report-out', meta: 'La Jolla ADU · 11:00 AM', status: 'Active', completed: true },
        { title: 'Procurement release: windows + doors', meta: 'Prospect House · Due today', status: 'In Progress', completed: false },
        { title: 'Update city plan checker with addendum', meta: 'SD Permit Center · Awaiting upload', status: 'Unblocking', completed: false },
        { title: 'Crew safety brief + JHA sign-off', meta: 'Field Ops · 7:00 AM', status: 'Active', completed: true },
        { title: 'Client walkthrough scheduling', meta: 'Oceanfront Remodel · Coordinate PM', status: 'Scheduling', completed: false },
      ];

      const baselineCompleted = tasks.filter((task) => task.completed).length;

      const formatNumber = (value) => value.toLocaleString('en-US');

      const computeHeatLevel = (value, max) => {
        if (!max) return 0;
        const ratio = value / max;
        return Math.min(5, Math.max(0, Math.round(ratio * 5)));
      };

      const renderActionGrid = () => {
        if (!actionGrid) return;

        const max = Math.max(...operations.weeks);
        actionGrid.innerHTML = '';

        operations.weeks.forEach((count, index) => {
          const tile = document.createElement('div');
          tile.className = 'action-tile';
          tile.dataset.level = computeHeatLevel(count, max);
          tile.setAttribute('role', 'gridcell');
          tile.setAttribute('tabindex', '0');
          tile.setAttribute('aria-label', `Week ${index + 1}: ${count} actions completed`);

          const tooltip = document.createElement('span');
          tooltip.className = 'tooltip';
          tooltip.textContent = `Week ${index + 1}: ${count} actions`;

          tile.appendChild(tooltip);
          actionGrid.appendChild(tile);
        });
      };

      const updateStats = () => {
        const completedCount = tasks.filter((task) => task.completed).length;
        const completionRate = Math.round((completedCount / tasks.length) * 100);
        const adjustedWeekActions = operations.weeks[operations.weeks.length - 1] + (completedCount - baselineCompleted);
        const delta = operations.lastWeek ? Math.round(((adjustedWeekActions - operations.lastWeek) / operations.lastWeek) * 100) : 0;

        if (statWeekActions) {
          statWeekActions.textContent = formatNumber(adjustedWeekActions);
        }

        if (statWeekDelta) {
          const sign = delta > 0 ? '+' : '';
          statWeekDelta.textContent = `${sign}${delta}% vs last week`;
        }

        if (statCompleteCount) {
          statCompleteCount.textContent = formatNumber(completedCount);
        }

        if (statCompletePercent) {
          statCompletePercent.textContent = `${completionRate}% completion`;
        }

        if (statCycleTime) {
          statCycleTime.textContent = operations.cycleTime;
        }

        if (statActionsToday) {
          statActionsToday.textContent = formatNumber(operations.actionsToday + (completedCount - baselineCompleted));
        }

        if (statCompletionRate) {
          statCompletionRate.textContent = `${completionRate}%`;
        }

        if (statOnTime) {
          statOnTime.textContent = `${operations.onTime}%`;
        }

        if (statQuality) {
          statQuality.textContent = operations.quality.toFixed(1);
        }

        if (statResponse) {
          statResponse.textContent = operations.response;
        }

        if (progressOnTime) {
          progressOnTime.style.width = `${operations.onTime}%`;
        }

        if (progressQuality) {
          progressQuality.style.width = `${Math.min(100, Math.max(0, (operations.quality / 10) * 100))}%`;
        }

        if (progressResponse) {
          progressResponse.style.width = '86%';
        }
      };

      const renderTasks = () => {
        if (!taskList) return;

        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
          const item = document.createElement('li');
          item.className = 'task-item';
          if (task.completed) {
            item.classList.add('completed');
          }

          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'task-toggle';
          toggle.setAttribute('aria-pressed', task.completed ? 'true' : 'false');
          toggle.setAttribute('aria-label', `${task.completed ? 'Unmark' : 'Mark'} ${task.title} as complete`);
          if (task.completed) {
            toggle.classList.add('completed');
            toggle.textContent = '✓';
          }

          const content = document.createElement('div');
          content.className = 'task-content';

          const title = document.createElement('div');
          title.className = 'task-title';
          title.textContent = task.title;

          const meta = document.createElement('div');
          meta.className = 'task-meta';
          meta.textContent = task.meta;

          content.appendChild(title);
          content.appendChild(meta);

          const status = document.createElement('span');
          status.className = 'task-status';
          status.textContent = task.status;

          toggle.addEventListener('click', () => {
            task.completed = !task.completed;
            item.classList.toggle('completed', task.completed);
            toggle.classList.toggle('completed', task.completed);
            toggle.textContent = task.completed ? '✓' : '';
            toggle.setAttribute('aria-pressed', task.completed ? 'true' : 'false');
            toggle.setAttribute('aria-label', `${task.completed ? 'Unmark' : 'Mark'} ${task.title} as complete`);
            updateStats();
          });

          item.appendChild(toggle);
          item.appendChild(content);
          item.appendChild(status);
          taskList.appendChild(item);
        });
      };

      renderActionGrid();
      renderTasks();
      updateStats();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
