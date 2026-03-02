/**
 * Portfolio Dynamic Loader & Interactivity
 * Data is loaded from assets/data/content.json
 */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('assets/data/content.json');
        if (!response.ok) throw new Error(`Failed to load content.json: ${response.status}`);
        const data = await response.json();
        
        renderProfile(data.profile);
        renderAbout(data.about);
        renderSkills(data.skills);
        renderCloudSection(data.cloudOverview);
        renderProjects(data.projects);
        renderTimeline(data.experience, data.education, data.projects);
        renderProfDev(data.professionalDevelopment);
        renderGithubSection(data);
        renderLanguages(data.profile.languages);
        setupInteractivity();
        console.log("Portfolio fully rendered and interactive.");
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
});

function renderProfile(profile) {
    if (!profile) return;
    document.getElementById('name').textContent = profile.name;
    document.getElementById('headline').textContent = profile.headline;
    document.getElementById('valueProposition').textContent = profile.tagline || profile.valueProposition;

    const toolsContainer = document.getElementById('tools');
    toolsContainer.innerHTML = '';
    profile.tools.forEach(tool => {
        const span = document.createElement('span');
        span.className = 'tool-tag';
        span.textContent = tool;
        toolsContainer.appendChild(span);
    });

    document.getElementById('linkedin-link').href = profile.contact.linkedin;
    document.getElementById('github-link').href = profile.contact.github;
    document.getElementById('email-link').href = `mailto:${profile.contact.email}`;

    document.getElementById('contact-email-link').href = `mailto:${profile.contact.email}`;
    document.getElementById('contact-email-text').textContent = profile.contact.email;
    document.getElementById('contact-linkedin-link').href = profile.contact.linkedin;
    document.getElementById('closing-line').textContent = profile.contact.closing;
}

function renderAbout(about) {
    if (!about) return;
    document.getElementById('about-intro').textContent = about.summary;
    const narrativeContainer = document.getElementById('about-narrative');
    narrativeContainer.innerHTML = '';
    about.whatIBring.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        narrativeContainer.appendChild(li);
    });
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!skills || !container) return;
    container.innerHTML = '';
    skills.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'skill-category';
        let html = `<h3>${cat.category}</h3>`;
        cat.items.forEach(skill => {
            html += `
                <div class="skill-item">
                    <div class="skill-name">${skill.name} <i class="fas fa-chevron-down"></i></div>
                    <div class="skill-context">${skill.context}</div>
                </div>`;
        });
        div.innerHTML = html;
        container.appendChild(div);
    });
}

function renderCloudSection(cloud) {
    if (!cloud) return;
    document.getElementById('cloud-summary').textContent = cloud.summary;
    const usecasesContainer = document.getElementById('cloud-usecases');
    usecasesContainer.innerHTML = '';
    cloud.useCases.forEach(uc => {
        const li = document.createElement('li');
        li.textContent = uc;
        usecasesContainer.appendChild(li);
    });
    const toolsContainer = document.getElementById('cloud-tools-list');
    toolsContainer.innerHTML = '';
    cloud.tools.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tool-tag';
        span.textContent = t;
        toolsContainer.appendChild(span);
    });
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!projects || !container) return;
    container.innerHTML = '';
    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        const toolsHtml = proj.tools.map(t => `<span>${t}</span>`).join('');
        const imageHtml = proj.image ? `<div class="project-image" style="background-image: url('${proj.image}');"></div>` : '';
        const githubButton = proj.github && proj.github !== '#' ?
            `<a href="${proj.github}" class="btn-github" target="_blank"><i class="fab fa-github"></i> View Code</a>` : '';
        card.innerHTML = `
            ${imageHtml}
            <div class="project-body">
                <span class="project-cat">${proj.category}</span>
                <h3>${proj.title}</h3>
                <div class="project-details">
                    <div class="detail-row"><strong>Problem:</strong> <p>${proj.problem}</p></div>
                    <div class="detail-row"><strong>Data:</strong> <p>${proj.data}</p></div>
                    <div class="detail-row"><strong>Insights:</strong> <p>${proj.insights || 'N/A'}</p></div>
                    <div class="detail-row"><strong>Impact:</strong> <p>${proj.impact}</p></div>
                </div>
            </div>
            <div class="project-footer">
                <div class="proj-tools">${toolsHtml}</div>
                ${githubButton}
            </div>`;
        container.appendChild(card);
    });
}

function parseDateForSort(dateStr) {
    // sort on end date (default behaviour for most entries)
    if (!dateStr) return 0;
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    let mainDate = dateStr;
    if (dateStr.includes('-')) mainDate = dateStr.split('-')[1].trim();
    if (mainDate.toLowerCase().includes('present')) return 999999;
    const parts = mainDate.toLowerCase().match(/(\w{3})?\s*(\d{4})/);
    if (!parts) return 0;
    const month = parts[1] ? months[parts[1]] : 0;
    const year = parseInt(parts[2]);
    return year * 100 + month;
}

function parseDateForSortStart(dateStr) {
    // sort on start date (used for education to keep earlier entries closer to their start)
    if (!dateStr) return 0;
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    let mainDate = dateStr;
    if (dateStr.includes('-')) mainDate = dateStr.split('-')[0].trim();
    if (mainDate.toLowerCase().includes('present')) return 999999;
    const parts = mainDate.toLowerCase().match(/(\w{3})?\s*(\d{4})/);
    if (!parts) return 0;
    const month = parts[1] ? months[parts[1]] : 0;
    const year = parseInt(parts[2]);
    return year * 100 + month;
}

function renderTimeline(experience, education, projects) {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    container.innerHTML = '';

    const combined = [
        ...experience.work.map(item => ({ ...item, sourceType: 'work', sortValue: parseDateForSort(item.date) })),
        ...experience.volunteering.map(item => ({ ...item, sourceType: 'volunteering', sortValue: parseDateForSort(item.date) })),
        ...education.map(item => ({ ...item, sourceType: 'education', sortValue: parseDateForSortStart(item.date) })),
        ...projects.map(proj => ({
            date: proj.date,
            title: proj.title,
            organization: proj.category,
            summary: proj.problem,
            sourceType: 'project',
            impact: proj.impact,
            sortValue: parseDateForSort(proj.date)
        }))
    ];

    combined.sort((a, b) => b.sortValue - a.sortValue);

    combined.forEach((item) => {
        const div = document.createElement('div');
        // place items based on type only, keeping chronological order but fixed sides
        let alignment = 'right';
        if (item.sourceType === 'education') {
            alignment = 'left';
        } else {
            // work, volunteering and projects all stay on right side
            alignment = 'right';
        }

        div.className = `timeline-item ${item.sourceType} ${alignment}`;
        let metaHtml = '';
        if (item.sourceType !== 'project') {
            metaHtml = item.achievements ? `<ul class="timeline-bullets">${item.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : '';
        } else {
            metaHtml = `<div class="timeline-impact"><strong>Impact:</strong> ${item.impact}</div>`;
        }

        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-type-tag">${item.sourceType}</span>
                <span class="timeline-date">${item.date}</span>
                <h3>${item.title}</h3>
                <p class="timeline-org">${item.organization}</p>
                <p class="timeline-summary">${item.summary}</p>
                ${metaHtml}
            </div>`;
        container.appendChild(div);
    });
}

function renderProfDev(profDev) {
    const container = document.getElementById('prof-dev-container');
    if (!profDev || !container) return;
    container.innerHTML = '';

    profDev.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cert-card';
        if (item.noExpand) div.classList.add('no-expand');

        let contentHtml = '';
        if (item.achievements && Array.isArray(item.achievements)) {
            contentHtml += `<ul class="cert-bullets">`;
            item.achievements.forEach(ach => contentHtml += `<li>${ach}</li>`);
            contentHtml += `</ul>`;
        }
        if (item.details) contentHtml += `<p class="cert-details-text">${item.details}</p>`;
        // exclude motivation paragraph for Goldman Sachs simulations
        const isGoldman = item.name && item.name.toLowerCase().includes('goldman');
        if (item.motivation && !isGoldman) {
            contentHtml += `
                <div class="prof-motivation">
                    <strong>Why are you interested in this role?</strong>
                    <p>${item.motivation}</p>
                </div>`;
        }

        div.innerHTML = `
            <div class="cert-header">
                <h3>${item.name}</h3>
                <div class="cert-meta"><span>${item.issuer}</span><span>${item.date}</span></div>
            </div>
            <div class="cert-details">${contentHtml}</div>`;
        container.appendChild(div);
    });
}

function renderGithubSection(data) {
    const container = document.getElementById('github-repos-container');
    if (!container) return;
    container.innerHTML = '';

    if (data.githubRepos && data.githubRepos.length) {
        data.githubRepos.forEach(r => {
            const div = document.createElement('div');
            div.className = 'repo-card';
            div.innerHTML = `<a href="${r.url}" target="_blank"><i class="fab fa-github"></i> ${r.name}</a>`;
            container.appendChild(div);
        });
    }
    // featured project links handled on each project card via button
}

function renderLanguages(langs) {
    const container = document.getElementById('languages-container');
    if (!langs || !container) return;
    container.innerHTML = '';
    langs.forEach(l => {
        const div = document.createElement('div');
        div.className = 'lang-tag';
        div.innerHTML = `<span>${l.name}</span> <small>(${l.level})</small>`;
        container.appendChild(div);
    });
}

function setupInteractivity() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            // toggle only this one
            skillItems.forEach(i => i !== item && i.classList.remove('active'));
            item.classList.toggle('active');
        });
        item.addEventListener('mouseenter', () => {
            skillItems.forEach(i => i !== item && i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        if (card.classList.contains('no-expand')) return; // skip disabled cards
        card.addEventListener('click', () => {
            certCards.forEach(c => c !== card && c.classList.remove('active'));
            card.classList.toggle('active');
        });
        card.addEventListener('mouseenter', () => {
            certCards.forEach(c => c !== card && c.classList.remove('active'));
            card.classList.add('active');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('active');
        });
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            timelineItems.forEach(i => i !== item && i.classList.remove('active'));
            item.classList.toggle('active');
        });
        item.addEventListener('mouseenter', () => {
            timelineItems.forEach(i => i !== item && i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
