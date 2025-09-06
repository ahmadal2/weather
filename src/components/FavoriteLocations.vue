<template>
  <div class="favorites-container">
    <h3>{{ $t('favorites') }}</h3>
    <div v-if="favorites.length === 0" class="no-favorites">
      <p>{{ $t('favorites') }} {{ $t('searchToGetStarted') }}</p>
    </div>
    <div v-else class="favorites-list">
      <div 
        v-for="favorite in favorites" 
        :key="favorite.id"
        class="favorite-item"
        @click="selectFavorite(favorite)"
      >
        <div class="favorite-info">
          <h4>{{ favorite.name }}</h4>
          <p>{{ favorite.country }}</p>
        </div>
        <button 
          class="remove-favorite"
          @click.stop="removeFavorite(favorite.id)"
          :title="$t('removeFromFavorites')"
        >
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWeatherStore } from '../stores/weather'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const weatherStore = useWeatherStore()
const favorites = computed(() => weatherStore.getFavorites)

const emit = defineEmits(['selectFavorite'])

// Select a favorite location
const selectFavorite = (favorite) => {
  emit('selectFavorite', favorite)
}

// Remove a favorite location
const removeFavorite = (id) => {
  weatherStore.removeFavorite(id)
}
</script>

<style scoped>
.favorites-container {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.favorites-container h3 {
  margin: 0 0 15px 0;
  color: #e2e8f0;
  font-size: 1.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.no-favorites {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.favorite-item:hover {
  background: rgba(15, 23, 42, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.favorite-info h4 {
  margin: 0 0 5px 0;
  color: #e2e8f0;
}

.favorite-info p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.remove-favorite {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-favorite:hover {
  background: rgba(248, 113, 113, 0.3);
  transform: scale(1.1);
}
</style>
