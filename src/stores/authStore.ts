import { AuthActionType, AuthStoreInterface } from './types';
import { accessTokenStorage, userIdStorage } from './localStorage';

class AuthStore implements AuthStoreInterface {
  mutateState({ actionType, payload }: { actionType: AuthActionType; payload: unknown }) {
    if (actionType === 'signIn') {
      this.signInUserInfo(payload);
    }
    if (actionType === 'login') {
      this.login(payload);
    }
    if (actionType === 'logout') {
      this.logOut();
    }
  }

  async signInUserInfo(payload) {
    const { email, name, password } = payload;

    const userData = JSON.stringify({ email, name, password });

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userData,
      });

      if (response.status === 400) {
        throw new Error('회원가입에 실패하였습니다!');
      }

      const {
        accessToken,
        user: { id },
      } = await response.json();

      accessTokenStorage.setAccessToken(accessToken);
      userIdStorage.setUserId(id);
      window.location.href = 'http://localhost:9000/#';
    } catch ({ message }) {
      alert(message);
    }
  }

  async login(payload) {
    const { email, password } = payload;

    const loginData = JSON.stringify({ email, password });

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: loginData,
      });
      if (response.status === 400) {
        throw new Error('아이디와 비밀번호를 다시 확인해주세요');
      }

      const {
        accessToken,
        user: { id },
      } = await response.json();

      accessTokenStorage.setAccessToken(accessToken);
      userIdStorage.setUserId(id);
      window.location.href = 'http://localhost:9000/#';
    } catch ({ message }) {
      alert(message);
    }
  }

  logOut() {
    localStorage.clear();
    window.location.href = 'http://localhost:9000/#';
  }
}

export default new AuthStore();
