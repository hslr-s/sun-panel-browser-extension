<script lang="ts" setup>
import { withDefaults } from 'vue'

import { NIcon, NTooltip } from 'naive-ui'
import { AlertCircleSharp } from '@vicons/ionicons5'

withDefaults(defineProps<{
  content?: string
}>(), {
  content: '',
})
</script>

<template>
  <span>
    <NTooltip>
      <template #trigger>
        <slot name="icon">
          <NIcon>
            <AlertCircleSharp />
          </NIcon>
        </slot>
      </template>
      <slot>
        {{ content }}
      </slot>
    </NTooltip>
  </span>
</template>
