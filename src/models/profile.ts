import mongoose from 'mongoose';
import { Profile } from '../types/profile';
import { TokenDoc } from './token';
const { Schema, Types } = mongoose;

// An interface that describes what attributes a profile model should have
interface ProfileModel extends mongoose.Model<ProfileDoc> {
    build(attrs: Profile): ProfileDoc
}

// An interface that descibes single profile properties
interface ProfileDoc extends mongoose.Document {
    telegram?: string;
    website?: string;
    twitter?: string;
    liquidity_functions?: string;
    sell_functions?: string;
    buy_functions?: string;
    cooldown?: boolean;
    bots?: boolean;
    openzeppelin?: boolean;
    est_launch_date?: Date;
}

// Creating profile schema
const ProfileSchema = new Schema({
    telegram: { type: String },
    website: { type: String },
    twitter: { type: String },
    liquidity_functions: { type: String },
    buy_functions: { type: String },
    sell_functions: { type: String },
    cooldown: { type: Boolean, default: false },
    bots: { type: Boolean, default: false },
    openzeppelin: { type: Boolean, default: false },
    est_launch_date: { type: Date },
},
    {
        timestamps: true
    }
)

// Statics
ProfileSchema.static('build', (attrs: Profile) => { return new Profile(attrs) })

// Creating profile model
const Profile = mongoose.model<ProfileDoc, ProfileModel>('Profile', ProfileSchema)

export { Profile, ProfileDoc }