<template>
  <Card class="top-[300px] w-[300px] ml-4 mt-4">
    <template #content>
      <Accordion :value="['0']" multiple>
        <AccordionPanel
          v-for="(item, index) in accordionItems"
          :key="index"
          :value="index.toString()"
        >
          <AccordionHeader class="text-lg font-semibold">{{
            item.header
          }}</AccordionHeader>
          <AccordionContent>
            <div class="flex flex-col space-y-2">
              <div
                v-for="(clickableItem, itemIndex) in item.clickableItems"
                :key="itemIndex"
                class="p-2 transition-colors bg-gray-200 border rounded-lg cursor-pointer hover:bg-gray-300"
                @click="handleItemClick(clickableItem)"
              >
                {{ clickableItem.label }}
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";

const accordionItems = ref([
  {
    header: "Laser Treatment",
    clickableItems: [
      { label: "Gleaming Beauty Rejuvenation", action: "A1" },
      { label: "Dual layer laser", action: "A2" },
      { label: "Vascular lesions", action: "A3" },
      { label: "Lips Rejuvenation", action: "A4" },
      { label: "Cryo treatment", action: "A5" },
    ],
  },
  {
    header: "3D Beautification",
    clickableItems: [
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
    header: "Skin Booster",
    clickableItems: [
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
    header: "Skin Cocktail",
    clickableItems: [
      { label: "S.M.A.R.T", action: "CA1" },
      { label: "Skin Rescue", action: "CA2" },
      { label: "Glow Ink", action: "CA3" },
      { label: "Moizkin", action: "CA4" },
      { label: "Microbotox", action: "CA5" },
    ],
  },
  {
    header: "Signature Booster",
    clickableItems: [
      { label: "Nano Revive Cell Rej", action: "CB1" },
      { label: "Collagen Stimulator", action: "CB2" },
      { label: "Bio Density", action: "CB3" },
      { label: "Maxi Glam", action: "CB4" },
      { label: "Juvelook", action: "CB5" },
    ],
  },
  {
    header: "Derma Cell Stim",
    clickableItems: [
      { label: "DermaCell Stimulator", action: "CC1" },
      { label: "AQ Growth Factor", action: "CC2" },
      { label: "Exosome", action: "CC3" },
      { label: "PoliVit GF", action: "CC4" },
    ],
  },
  {
    header: "Facial",
    clickableItems: [
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
    header: "Adds On",
    clickableItems: [
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
    header: "Countouring",
    clickableItems: [
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
    header: "Injection",
    clickableItems: [
      { label: "Fat Cells Go Away (Kybella)", action: "H1" },
      { label: "Immune Booster", action: "H2" },
      { label: "VIT. C Injection", action: "H3" },
      { label: "Premium Coktail", action: "H4" },
      { label: "Cell Renewal Booster", action: "H5" },
    ],
  },
  {
    header: "3Deep",
    clickableItems: [
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
    header: "MMFU",
    clickableItems: [
      { label: "MMFU MPT", action: "K1" },
      { label: "Onlift Booster", action: "K2" },
    ],
  },
]);

// Handle item click
const handleItemClick = (clickableItem) => {
  console.log(
    `Item clicked: ${clickableItem.label}, Action: ${clickableItem.action}`
  );
  // Implement your action based on clickableItem.action here
};
</script>
