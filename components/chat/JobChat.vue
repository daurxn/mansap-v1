<script setup lang="ts">
import { toast } from "vue-sonner";
import { useToken } from "~/composables/auth/useToken";
import { useAuthStore } from "~/store/auth.store";
import { useI18n } from "vue-i18n";
import type { Chat } from "~/types/chat";

const props = defineProps<{
  chat: Chat;
  jobId: string | number;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const { userId } = storeToRefs(useAuthStore());
const token = useToken();
const { t } = useI18n();
const message = ref("");
const isSending = ref(false);
const isUploading = ref(false);
const imageUrl = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);

// Debug: Log chat messages when they change
watchEffect(() => {
  if (props.chat?.messages?.length) {
    console.log('Chat messages:', props.chat.messages);
    // Log the first message to see its structure
    console.log('First message object:', props.chat.messages[0]);
    // Check if imageUrl exists in any message
    const hasImageUrl = props.chat.messages.some(msg => msg.imageUrl);
    console.log('Any message has imageUrl?', hasImageUrl);
  }
});

console.log(props.chat);

const headers = computed(() => ({
  Authorization: `Bearer ${token.value}`,
}));

// Create a computed property that ensures messages have the correct structure
const processedMessages = computed(() => {
  if (!props.chat?.messages) return [];
  
  // Log all messages to debug
  console.log('Processing messages:', JSON.stringify(props.chat.messages));
  
  return props.chat.messages.map(msg => {
    // Check if the message object has imageUrl directly
    const hasDirectImageUrl = Object.prototype.hasOwnProperty.call(msg, 'imageUrl');
    console.log(`Message ${msg.id} has direct imageUrl property: ${hasDirectImageUrl}`);
    
    // Try to access imageUrl in different ways
    const imageUrl = msg.imageUrl || null;
    
    return {
      ...msg,
      imageUrl
    };
  });
});

async function handleSendMessage() {
  console.log('handleSendMessage called, message:', message.value, 'imageUrl:', imageUrl.value);
  if ((!message.value && !imageUrl.value) || !props.chat) return;

  isSending.value = true;
  try {
    // Debug current state
    console.log('Current imageUrl.value before sending:', imageUrl.value);
    console.log('imageUrl.value type:', typeof imageUrl.value);
    console.log('imageUrl.value length:', imageUrl.value ? imageUrl.value.length : 0);
    
    // Create request body with explicit imageUrl handling
    const requestBody: {
      chatId: number;
      content: string;
      imageUrl?: string;
    } = {
      chatId: props.chat.id,
      content: message.value || ' ', // Ensure content is never empty
    };
    
    // Only add imageUrl if it exists and is not empty
    if (imageUrl.value && imageUrl.value.trim() !== '') {
      console.log('Adding imageUrl to request:', imageUrl.value);
      requestBody.imageUrl = imageUrl.value;
    } else {
      console.log('imageUrl is empty or undefined, not adding to request');
    }
    
    console.log('Sending message with body:', JSON.stringify(requestBody));
    
    const response = await $fetch("/api/chat/message", {
      method: "POST",
      headers: headers.value,
      body: requestBody,
    });
    
    console.log('Message sent response:', response);

    message.value = "";
    imageUrl.value = "";
    
    // Force refresh to get updated messages
    await emit("refresh");
    
    // Add a small delay to ensure the UI updates
    setTimeout(() => {
      console.log('Messages after refresh:', processedMessages.value);
    }, 500);
  } catch (error) {
    console.error("Failed to send message:", error);
    toast.error("Failed to send message. Please try again.");
  } finally {
    isSending.value = false;
  }
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateString));
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  console.log('Selected file:', file.name, file.type, file.size);
  
  const formData = new FormData();
  formData.append("file", file);

  isUploading.value = true;
  try {
    console.log('Uploading image to /api/upload/chat-image');
    const response = await $fetch<{ imageUrl: string }>(
      "/api/upload/chat-image",
      {
        method: "POST",
        body: formData,
        headers: headers.value,
      }
    );

    console.log('Upload response:', response);
    if (response && response.imageUrl) {
      console.log('Setting imageUrl.value to:', response.imageUrl);
      imageUrl.value = response.imageUrl;
      toast.success(t("profile.upload") + " " + t("common.success"));
    } else {
      console.error('Response missing imageUrl:', response);
      toast.error('Upload succeeded but no image URL was returned');
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(t("profile.upload_failed"));
  } finally {
    isUploading.value = false;
    // Clear the input so the same file can be selected again
    if (target) target.value = "";
  }
}
</script>

<template>
  <Card class="w-full max-w-[28rem]">
    <CardHeader>
      <CardTitle>Чат</CardTitle>
      <CardDescription>Между заказчиком и фрилансером</CardDescription>
    </CardHeader>

    <CardContent class="space-y-4 max-h-[400px] overflow-y-auto">
      <Card
        v-for="msg in processedMessages"
        :key="msg.id"
        class="gap-0 py-4 text-xs max-w-[75%]"
        :class="{ 'ml-auto': msg.senderId === userId }"
      >
        <CardHeader class="px-4">
          <CardTitle>
            {{ msg.sender.name }}
          </CardTitle>
        </CardHeader>

        <CardContent class="px-4 text-gray-500">
          <div>{{ msg.content }}</div>
          
          <!-- Debug: Show raw message object -->
          <pre v-if="false" class="text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded mt-2">{{ JSON.stringify(msg, null, 2) }}</pre>
          
          <img 
            v-if="msg.imageUrl" 
            :src="msg.imageUrl" 
            alt="Chat image" 
            class="mt-2 max-w-full rounded-md"
          >
        </CardContent>

        <CardFooter>
          <div class="text-end w-full text-xs text-gray-600">
            {{ formatDate(msg.createdAt) }}
          </div>
        </CardFooter>
      </Card>
    </CardContent>

    <CardFooter>
      <form
        class="flex items-center gap-1.5 w-full"
        @submit.prevent="handleSendMessage"
      >
        <div v-if="imageUrl" class="relative mr-2">
          <img
            :src="imageUrl"
            alt="Upload preview"
            class="h-10 w-10 object-cover rounded"
          />
          <button
            type="button"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            @click="imageUrl = ''"
          >
            ×
          </button>
        </div>

        <Input
          v-model="message"
          type="text"
          :placeholder="$t('jobs.message')"
          :disabled="isSending || isUploading"
          class="flex-grow"
        />

        <div class="relative">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            :disabled="isSending || isUploading"
            @change="handleImageUpload"
          />
          <Button
            type="button"
            variant="outline"
            class="px-3"
            :disabled="isSending || isUploading"
            @click="fileInputRef?.click()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
              />
            </svg>
          </Button>
        </div>

        <Button
          type="submit"
          :disabled="isSending || isUploading || (!message && !imageUrl)"
        >
          {{ $t("jobs.send") }}
        </Button>
      </form>
    </CardFooter>
  </Card>
</template>
