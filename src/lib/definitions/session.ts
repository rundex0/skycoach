import {JwtPayload} from "jsonwebtoken";


export interface SessionPayload extends JwtPayload {
    uid: string
}