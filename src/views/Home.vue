<template>
  <div class="container py-4 d-flex flex-column" style="height: 100vh">
    <div class="card flex-grow-1 overflow-auto mb-3">
      <div class="card-body" ref="chatWindow">
        <div
          v-for="(chat, index) in chats"
          :key="index"
          class="mb-2 d-flex"
          :class="
            chat.role === 'user'
              ? 'justify-content-end'
              : 'justify-content-start'
          "
        >
          <div
            class="px-3 py-2 rounded"
            :class="chat.role === 'user' ? 'bg-primary text-white' : 'bg-light'"
          >
            {{ chat.content }}
          </div>
        </div>
      </div>
    </div>

    <div class="input-group">
      <input
        type="text"
        class="form-control"
        v-model="userMessage"
        @keyup.enter="handleEnter"
        placeholder="메시지를 입력하세요"
      />
      <button class="btn btn-primary" @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";

const userMessage = ref("");
const chats = ref([]);

const userId = 1;
const characterId = 7;

let sending = false;

const sendMessage = async () => {
  if (sending || !userMessage.value.trim()) return;
  sending = true;

  chats.value.push({ role: "user", content: userMessage.value });

  try {
    const res = await axios.post(import.meta.env.VITE_API_URL, {
      user_id: userId,
      character_id: characterId,
      message: userMessage.value,
    });
    userMessage.value = "";

    if (res.data.status === "success") {
      chats.value.push({ role: "assistant", content: res.data.response });
    } else {
      chats.value.push({ role: "assistant", content: res.data.message });
    }
  } catch (e) {
    console.error(e);
    chats.value.push({ role: "assistant", content: "네트워크 오류 발생!" });
  } finally {
    userMessage.value = "";
    sending = false;

    await nextTick();
    const chatWindow = document.querySelector(".card-body");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};

const handleEnter = (e) => {
  if (!e.isComposing) {
    sendMessage();
  }
};
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";

.container {
  max-width: 600px;
}
</style>
