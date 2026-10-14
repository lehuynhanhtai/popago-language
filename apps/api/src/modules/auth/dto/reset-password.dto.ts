import { ApiProperty } from '@nestjs/swagger';
import type { ResetPasswordInput } from '@repo/shared';

export class ResetPasswordDto implements ResetPasswordInput {
  @ApiProperty({
    example: 'oobCode_from_email_link',
    description: 'Mã xác thực đặt lại mật khẩu nhận từ đường link email Firebase',
  })
  oobCode!: string;

  @ApiProperty({
    example: 'NewPassword123@',
    description: 'Mật khẩu mới (tối thiểu 6 ký tự)',
  })
  newPassword!: string;
}
