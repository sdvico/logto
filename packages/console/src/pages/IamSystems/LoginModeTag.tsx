import DangerousRaw from '@/ds-components/DangerousRaw';
import Tag from '@/ds-components/Tag';

import { type IamLogin, loginModeTitles } from './systems';

type Props = {
  /** `undefined`: hệ chưa gắn app đăng nhập. */
  readonly login?: IamLogin;
};

const statusOf = {
  open: 'success',
  limited: 'info',
  blocked: 'error',
} as const;

/** Nhãn trạng thái đăng nhập của một hệ, cùng kiểu nhãn trạng thái của Logto. */
function LoginModeTag({ login }: Props) {
  if (!login) {
    return (
      <Tag type="state" status="alert" variant="plain">
        <DangerousRaw>Chưa có app đăng nhập</DangerousRaw>
      </Tag>
    );
  }

  return (
    <Tag type="state" status={statusOf[login.mode]} variant="plain">
      <DangerousRaw>{loginModeTitles[login.mode]}</DangerousRaw>
    </Tag>
  );
}

export default LoginModeTag;
