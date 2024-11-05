<template>
  <div class="w-[300px] ml-4 mt-4 relative menu-sidebar">
    <Listbox
      v-model="selectedBox"
      :options="accordionItems"
      class="w-full hidden-scrollbar"
      listStyle="max-height:70vh"
      @click="toggleSubMenu"
    >
      <template #option="{ option }">
        <div class="flex justify-between cursor-pointer">
          <div>{{ option.label }}</div>
        </div>
      </template>
    </Listbox>

    <!-- Teleport for Submenu -->
    <Teleport to="#teleports">
      <transition name="fade">
        <div
          v-if="isVisible"
          class="submenu"
          :style="{ top: submenuPosition.top, left: submenuPosition.left }"
          ref="refSubMenu"
          v-click-outside="handleClickOutside"
        >
          <Listbox
            v-model="selectedSubItem"
            :options="selectedSubMenu.items"
            optionLabel="label"
            class="w-full sublist"
            listStyle="max-height:550px"
            @change="handleItemClick(selectedSubItem)"
          />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const selectedBox = ref("Laser Treatment");
const selectedSubItem = ref(null);
const selectedSubMenu = ref(null);
const refSubMenu = ref(null);
const status = ref("");
const isVisible = ref(false);
const submenuPosition = ref({ top: "0px", left: "0px" });

const accordionItems = ref([
  {
    label: "Laser Treatment",
    items: [
      { label: "Gleaming Beauty Rejuvenation", action: "A1" },
      { label: "Dual layer laser", action: "A2" },
      { label: "Vascular lesions", action: "A3" },
      { label: "Lips Rejuvenation", action: "A4" },
      { label: "Cryo treatment", action: "A5" },
    ],
  },
  {
    label: "3D Beautification",
    items: [
      { label: "Botox", action: "B1" },
      { label: "Filler", action: "B2" },
      { label: "Chin Filler", action: "B3" },
      { label: "Lip Filler", action: "B4" },
      { label: "Threadlift", action: "B5" },
      { label: "Hyperhidrosis", action: "B6" },
      { label: "Nose Augmentation", action: "B7" },
      { label: "Foxy Eyes", action: "B8" },
    ],
  },
  {
    label: "Skin Booster",
    items: [
      { label: "Glowing Booster", action: "C1" },
      { label: "Deep Skin Hydration", action: "C2" },
      { label: "Prohealer", action: "C3" },
      { label: "Baby Skin Rejuran", action: "C4" },
      { label: "Eye Booster", action: "C5" },
      { label: "Lips Booster", action: "C6" },
      { label: "Collagen Neck", action: "C7" },
      { label: "Profhilo", action: "C8" },
      { label: "Profhilo Body", action: "C9" },
      { label: "Skin Enhancer", action: "C10" },
    ],
  },
  {
    label: "Skin Cocktail",
    items: [
      { label: "S.M.A.R.T", action: "CA1" },
      { label: "Skin Rescue", action: "CA2" },
      { label: "Glow Ink", action: "CA3" },
      { label: "Moizkin", action: "CA4" },
      { label: "Microbotox", action: "CA5" },
    ],
  },
  {
    label: "Signature Booster",
    items: [
      { label: "Nano Revive Cell Rej", action: "CB1" },
      { label: "Collagen Stimulator", action: "CB2" },
      { label: "Bio Density", action: "CB3" },
      { label: "Maxi Glam", action: "CB4" },
      { label: "Juvelook", action: "CB5" },
    ],
  },
  {
    label: "Derma Cell Stim",
    items: [
      { label: "DermaCell Stimulator", action: "CC1" },
      { label: "AQ Growth Factor", action: "CC2" },
      { label: "Exosome", action: "CC3" },
      { label: "PoliVit GF", action: "CC4" },
    ],
  },
  {
    label: "Facial",
    items: [
      { label: "Korean Facial", action: "D1" },
      { label: "Peeling Facial", action: "D2" },
      { label: "Oxygeneo Facial", action: "D3" },
      { label: "Deep Hydro Facial", action: "D4" },
      { label: "Acne Clear Facial", action: "D5" },
      { label: "PRP Facial", action: "D6" },
      { label: "Luminous Facial", action: "D7" },
      { label: "Oxyglam Facial", action: "D8" },
      { label: "Oxyglow Facial", action: "D9" },
      { label: "Vibrant Glamour Facial", action: "D10" },
      { label: "Glo2 Magic Sheet Facial", action: "D11" },
      { label: "Pure Intra Oxy Jet", action: "D12" },
    ],
  },
  {
    label: "Adds On",
    items: [
      { label: "Celluma Light Therapy", action: "E1" },
      { label: "PDT Light Therapy", action: "E2" },
      { label: "Oxy Jet", action: "E3" },
      { label: "Ekstraksi Komedo", action: "E4" },
      { label: "Magical Slim Ion Roller", action: "E5" },
      { label: "Premium Mask", action: "E6" },
      { label: "3in1 Microdermabrasion", action: "E7" },
    ],
  },
  {
    label: "Countouring",
    items: [
      { label: "Instant Lifting Alma", action: "F1" },
      { label: "Face Max Shaping", action: "F2" },
      { label: "Body Max Shaping", action: "F3" },
      { label: "Face In Shape", action: "F4" },
      { label: "Body In Shape", action: "F5" },
      { label: "Body Xlite", action: "F6" },
      { label: "Inshape", action: "F7" },
    ],
  },
  {
    label: "Injection",
    items: [
      { label: "Fat Cells Go Away (Kybella)", action: "H1" },
      { label: "Immune Booster", action: "H2" },
      { label: "VIT. C Injection", action: "H3" },
      { label: "Premium Coktail", action: "H4" },
      { label: "Cell Renewal Booster", action: "H5" },
    ],
  },
  {
    label: "3Deep",
    items: [
      { label: "Eyefine", action: "J1" },
      { label: "3Deep Beauty", action: "J2" },
      { label: "Silky Skin", action: "J3" },
      { label: "Scar Repair", action: "J4" },
      { label: "Hair Stimulator", action: "J5" },
      { label: "Acne Combat", action: "J6" },
      { label: "Stretchmark Reduction", action: "J7" },
      { label: "Hand Restoration", action: "J8" },
      { label: "Axillary Hyperhidrosis", action: "J9" },
    ],
  },
  {
    label: "MMFU",
    items: [
      { label: "MMFU MPT", action: "K1" },
      { label: "Onlift Booster", action: "K2" },
    ],
  },
]);

const toggleSubMenu = () => {
  isVisible.value = false;
  status.value = "";
  if (selectedBox.value) {
    selectedSubMenu.value = selectedBox.value;
    const itemElement = document.querySelector(
      ".p-listbox-option.p-listbox-option-selected"
    );

    if (itemElement != null) {
      const rect = itemElement.getBoundingClientRect();

      submenuPosition.value = {
        top: `${rect.top + window.scrollY + rect.height / 2}px`,
        left: `${rect.left + window.scrollX + 270}px`,
      };

      setTimeout(() => {
        status.value = "click";
      }, 500);
      isVisible.value = true;

      nextTick(() => {
        if (refSubMenu.value) {
          const rectSubmenu = refSubMenu.value.getBoundingClientRect();

          // Hitung posisi tengah vertikal yang diinginkan
          let desiredTop =
            rect.top +
            window.scrollY +
            rect.height / 2 -
            rectSubmenu.height / 2;

          // Pastikan submenu tidak keluar dari batas bawah viewport
          if (desiredTop + rectSubmenu.height > window.innerHeight) {
            desiredTop = window.innerHeight - rectSubmenu.height;
          }

          // Pastikan submenu tidak keluar dari batas atas viewport
          if (desiredTop < 0) {
            desiredTop = 0;
          }

          submenuPosition.value = {
            top: `${desiredTop}px`,
            left: `${rect.left + 288}px`,
          };
        }
      });
    }
  } else {
    submenuPosition.value = { top: "0px", left: "0px" };
  }
};

const handleClickOutside = () => {
  if (isVisible.value && status.value === "click") {
    isVisible.value = false;
    const itemElement = document.querySelector(
      ".p-listbox-option.p-listbox-option-selected"
    );
    if (itemElement) {
      itemElement.classList.remove("p-listbox-option-selected");
    }
  }
};

// Handle item click
const handleItemClick = (clickableItem) => {
  console.log(
    `Item clicked: ${clickableItem.label}, Action: ${clickableItem.action}`
  );
};
</script>

<style scoped>
.scrollable-container {
  max-height: 70vh;
  overflow-y: auto;
  /* Hide scrollbar */
  scrollbar-width: none; /* For Firefox */
}
.scrollable-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.submenu {
  position: absolute;
  z-index: 1000;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
