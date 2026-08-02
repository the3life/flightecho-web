import {Constants, type Database} from "../database.types.ts";
import {supabase} from "../services/supabase.ts";

export type Schema = Extract<keyof Database, "public" | "fe_v4">;
export type Table = keyof Database[Schema]["Tables"];
export type View = keyof Database[Schema]["Views"];
export type Relation = | Table | View;

// User

export type UserRole = Database[Schema]["Enums"]["user_roles"];

// News

export type NewsStatus = Database[Schema]["Enums"]["news_status"];
export const NewsSituations = Constants.fe_v4.Enums.news_status;

export function getRelation(schema: Schema, name: Table): ReturnType<typeof supabase.from>;
export function getRelation(schema: Schema, name: View): ReturnType<typeof supabase.from>;
export function getRelation(schema: Schema, name: Table | View) {
    return supabase.schema(schema).from(name as any);
}