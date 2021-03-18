"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
var typeorm_1 = require("typeorm");
var uuid_1 = require("uuid");
var UserTypeEntity_1 = require("./UserTypeEntity");
var UserEntity = /** @class */ (function () {
    function UserEntity() {
        this.id = "";
        this.idUserType = "";
        this.password = "";
        this.user = "";
        if (!this.id) {
            this.id = uuid_1.v4();
        }
    }
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], UserEntity.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserEntity.prototype, "idUserType", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return UserTypeEntity_1.UserTypeEntity; }),
        typeorm_1.JoinColumn({ name: "idUserType" }),
        __metadata("design:type", UserTypeEntity_1.UserTypeEntity)
    ], UserEntity.prototype, "userTypeEntity", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserEntity.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserEntity.prototype, "user", void 0);
    UserEntity = __decorate([
        typeorm_1.Entity("tbUsers"),
        __metadata("design:paramtypes", [])
    ], UserEntity);
    return UserEntity;
}());
exports.UserEntity = UserEntity;
