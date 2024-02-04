<template>
    <div class="container">
        <h1>Statistics</h1>
        <router-link to="statistics/history" class="content-card">
            <div class="icon">
                <img src="@/assets/history.svg" alt="History Icon" />
            </div>
            <h2>History</h2>
            <div class="right-icon">
                <img src="@/assets/chev_r.svg" alt="Right Icon" />
            </div>
        </router-link>
        <router-link to="statistics/analysis" class="content-card">
            <div class="icon">
                <img src="@/assets/statistics.svg" alt="Stat Icon" />
            </div>
            <h2>Analysis</h2>
            <div class="right-icon">
                <img src="@/assets/chev_r.svg" alt="Right Icon" />
            </div>
        </router-link>
    </div>
</template>