// Tournament Admin JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const searchInput = document.getElementById('tournaments-search');
  const tournamentsList = document.getElementById('tournaments-list');
  const tournamentsCount = document.getElementById('tournaments-count');
  
  // Only run if we have tournaments to search through
  if (searchInput && tournamentsList) {
    const tournamentItems = tournamentsList.querySelectorAll('.tournaments-list-item');
    const originalCount = tournamentItems.length;
    
    // Function to update the count display
    function updateCountDisplay(visibleCount) {
      if (tournamentsCount) {
        tournamentsCount.textContent = `${visibleCount} of ${originalCount} tournaments`;
      }
    }
    
    // Function to perform search
    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;
      
      tournamentItems.forEach(item => {
        const tournamentName = item.getAttribute('data-name');
        const titleElement = item.querySelector('.tournament-title');
        const originalTitle = titleElement.textContent;
        
        // Remove any existing highlights
        if (titleElement.innerHTML !== originalTitle) {
          titleElement.textContent = originalTitle;
        }
        
        // If search term is empty, show all items
        if (searchTerm === '') {
          item.style.display = 'flex';
          visibleCount++;
          return;
        }
        
        // Check if tournament name includes search term
        if (tournamentName.includes(searchTerm)) {
          item.style.display = 'flex';
          visibleCount++;
          
          // Highlight matching text
          if (searchTerm.length > 0) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            titleElement.innerHTML = originalTitle.replace(regex, '<span class="tournament-highlight">$1</span>');
          }
        } else {
          item.style.display = 'none';
        }
      });
      
      updateCountDisplay(visibleCount);
    }
    
    // Event listener for search input
    searchInput.addEventListener('input', performSearch);
    
    // Initialize count display
    updateCountDisplay(originalCount);
  }
});