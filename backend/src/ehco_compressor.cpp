#include <napi.h>
#include <string>
#include "compression_algorithms.cpp"

using namespace std;

Napi::Value CompressAudio(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2) {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    string inputFile = info[0].As<Napi::String>().Utf8Value();
    string outputFile = info[1].As<Napi::String>().Utf8Value();

    try {
        compressAudio(inputFile);
        return Napi::String::New(env, outputFile);
    } catch (const exception& e) {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }
}

Napi::Value DecompressAudio(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2) {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    string inputFile = info[0].As<Napi::String>().Utf8Value();
    string outputFile = info[1].As<Napi::String>().Utf8Value();

    try {
        decompressAudio(outputFile);
        return Napi::String::New(env, outputFile);
    } catch (const exception& e) {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("compressAudio", Napi::Function::New(env, CompressAudio));
    exports.Set("decompressAudio", Napi::Function::New(env, DecompressAudio));
    return exports;
}

NODE_API_MODULE(ehco_compressor, Init) 