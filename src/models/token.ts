import mongoose from 'mongoose';
import { Token } from '../types/token';
import { ProfileDoc } from './profile';
const { Schema, Types } = mongoose;


// An interface that describes what attributes a token model should have
interface TokenModel extends mongoose.Model<TokenDoc> {
    build(attrs: Token): TokenDoc
}

// An interface that descibes single token properties
interface TokenDoc extends mongoose.Document {
    name: string;
    address: string;
    balance: string;
    txns: number;
    dateVerified: Date;
    licence?: string;
    is_tradable?: boolean;
    has_launched?: boolean;
    profile?: ProfileDoc;
}

// Creating token schema
const TokenSchema = new Schema({
    name: { type: String },
    address: { type: String, unique: true },
    balance: { type: String },
    txns: { type: Number },
    dateVerified: { type: Date },
    licence: { type: String },
    is_tradable: { type: Boolean },
    has_launched: { type: Boolean },
    profile: { type: Types.ObjectId, ref: 'Profile' }
},
    {
        timestamps: true
    }
)

// Statics
TokenSchema.static('build', (attrs: Token) => { return new Token(attrs) })

// prefetches
TokenSchema.pre<TokenDoc>(/^find/, function (next) {
    this.populate({ path: "profile" });
    next();
});

// Creating token model
const Token = mongoose.model<TokenDoc, TokenModel>('Token', TokenSchema)

export { Token, TokenDoc }