<template>
  <div class="auth-card">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" class="auth-btn">{{ isLogin ? 'Sign In' : 'Sign Up' }}</button>
    </form>
    <p class="toggle-text" @click="isLogin = !isLogin">
      {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
    </p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.auth-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 400px; margin: 50px auto; text-align: center;}
.form-group { margin-bottom: 15px; text-align: left; }
input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
.auth-btn { width: 100%; padding: 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;}
.toggle-text { margin-top: 15px; color: #3498db; cursor: pointer; text-decoration: underline; }
.error { color: red; margin-top: 10px; }
</style>