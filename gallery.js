document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const projects = [
        "Games/ai.html",
        "Games/Vibe Coding/vibe_1.html",
        "Games/Vibe Coding/vibe_2.html",
        "Games/Vibe Coding/vibe_3.html",
        "Particles/7 Day Challenge/Day1/deepseek-day1.html",
        "Particles/7 Day Challenge/Day1/grok-day1.html",
        "Particles/7 Day Challenge/Day1/openai-day1.html",
        "Particles/7 Day Challenge/Day2/deepseek-day2.html",
        "Particles/7 Day Challenge/Day2/grok-day2.html",
        "Particles/7 Day Challenge/Day2/openai-day2.html",
        "Particles/7 Day Challenge/Day3/deekseek-day3.html",
        "Particles/7 Day Challenge/Day3/grok-day3.html",
        "Particles/7 Day Challenge/Day3/openai-day3.html",
        "Particles/7 Day Challenge/Day4/deepseek-day4.html",
        "Particles/7 Day Challenge/Day4/grok-day4.html",
        "Particles/7 Day Challenge/Day4/openai-day4.html",
        "Particles/7 Day Challenge/Day5/deekseek-day5a.html",
        "Particles/7 Day Challenge/Day5/deepseek-day5.html",
        "Particles/7 Day Challenge/Day5/grok-day5.html",
        "Particles/7 Day Challenge/Day5/openai-day5.html",
        "Particles/7 Day Challenge/Day6/deepseek-day6.html",
        "Particles/7 Day Challenge/Day6/deepseek-day6a.html",
        "Particles/7 Day Challenge/Day6/grok-day6.html",
        "Particles/7 Day Challenge/Day6/openAi-Day6.html",
        "Particles/7 Day Challenge/Day7/Deepseek-day7-1.html",
        "Particles/7 Day Challenge/Day7/Deepseek-day7-2.html",
        "Particles/7 Day Challenge/Day7/Deepseek-day7-3.html",
        "Particles/7 Day Challenge/Day7/Deepseek-day7-3a.html",
        "Particles/7 Day Challenge/Day7/Grok-day7-1.html",
        "Particles/7 Day Challenge/Day7/Grok-day7-2.html",
        "Particles/7 Day Challenge/Day7/Grok-day7-3.html",
        "Particles/7 Day Challenge/Day7/OpenAI-Day7-1.html",
        "Particles/7 Day Challenge/Day7/OpenAI-Day7-2.html",
        "Particles/7 Day Challenge/Day7/OpenAI-Day7-3.html",
        "Particles/7 Day Challenge/Day7/ds-7-1a.html",
        "Particles/First Examples/DS-Particle1.html",
        "Particles/First Examples/DS-Particle2.html",
        "Particles/First Examples/DS-Particle3.html",
        "Particles/First Examples/DS-Particle4.html",
        "Particles/First Examples/bigbang.html",
        "Particles/First Examples/bioluminesence.html",
        "Particles/First Examples/deep-particle1.html",
        "Particles/First Examples/deep-particle2.html",
        "Particles/First Examples/ds-2.html",
        "Particles/First Examples/fireflies.html",
        "Particles/First Examples/fireworks.html",
        "Particles/First Examples/fluidwaves.html",
        "Particles/First Examples/funkyswirlss.html",
        "Particles/First Examples/galaxy.html",
        "Particles/First Examples/magnetic.html",
        "Particles/First Examples/nebula.html",
        "Particles/First Examples/particlefluid.html",
        "Particles/First Examples/particlefluid2.html",
        "Particles/First Examples/vortextornado.html",
        "Particles/waveforms.html",
        "Simulations/asteroidsim.html",
        "Simulations/solarsystem.html",
        "Simulations/testing/OAI-Asteroids-2c.html",
        "Simulations/testing/OAI-Asteroids2.html",
        "Simulations/testing/OAI-Asteroids2a.html",
        "Simulations/testing/OAI-Asteroids2b.html",
        "Simulations/testing/OAI-Asteroids3.html",
        "Simulations/testing/OAI-asteroids1.html",
        "Simulations/testing/solar.html",
        "Simulations/testing/solar2.html",
        "Simulations/testing/solar3.html",
        "Simulations/testing/solar4.html"
    ];

    projects.forEach(projectPath => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const link = document.createElement('a');
        link.href = projectPath;
        link.target = '_blank'; // Open in a new tab

        const iframe = document.createElement('iframe');
        iframe.src = projectPath;
        // Disable interaction with the iframe to make the link work
        iframe.style.pointerEvents = 'none';

        const title = document.createElement('div');
        title.className = 'gallery-item-title';
        // Extract a user-friendly name from the path
        title.textContent = projectPath.split('/').pop().replace('.html', '').replace(/-/g, ' ');

        link.appendChild(iframe);
        link.appendChild(title);
        galleryItem.appendChild(link);
        galleryContainer.appendChild(galleryItem);
    });
});