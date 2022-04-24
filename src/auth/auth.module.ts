import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./strategies/constants";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		UsersService, 
		PassportModule,
		JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '611110s' },
    }),
	],
	providers: [
		AuthService, 
		UsersService, 
		LocalStrategy,
		JwtStrategy
	],
	controllers: [AuthController]
})
export class AuthModule {}