
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { stringUtf8CV, standardPrincipalCV } from "@stacks/transactions";

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/stacks/clarinet-js-sdk
*/

describe("genie post tests", () => {
  it("should create a post", () => {
    const accounts = simnet.getAccounts();
    const wallet = accounts.get("wallet_1")!;
    
    const { result } = simnet.callPublicFn("genie", "create-post", [stringUtf8CV("Hello, world!")], wallet);
    expect(result).toBeOk(Cl.stringAscii("Post created successfully"));
  });
});


describe("genie post edit",() =>{
  it("should edit a post ", () => {
    const accounts = simnet.getAccounts();
    const wallet = accounts.get("wallet_1")!;
    
    // Create a post
    const { result } = simnet.callPublicFn("genie", "create-post", [stringUtf8CV("Hello, world!")], wallet);
    expect(result).toBeOk(Cl.stringAscii("Post created successfully"));
    
    // Check if post exists
    const { result: postResult } = simnet.callReadOnlyFn("genie", "get-post", [standardPrincipalCV(wallet)], wallet);
    expect(postResult).toBeSome(Cl.stringUtf8("Hello, world!"));
    // Edit the post
    const { result: editResult } = simnet.callPublicFn("genie", "edit-post", [standardPrincipalCV(wallet), stringUtf8CV("Hello, world")], wallet);

    expect(editResult).toBeOk(Cl.stringAscii("Post edited successfully"));

  });

});

describe("genie post delete",() =>{
  it("should delete a post", () => {
    const accounts = simnet.getAccounts();
    const wallet = accounts.get("wallet_1")!;

        // Create a post
        const { result } = simnet.callPublicFn("genie", "create-post", [stringUtf8CV("Hello, world!")], wallet);
        expect(result).toBeOk(Cl.stringAscii("Post created successfully"));

          // Check if post exists
    const { result: postResult } = simnet.callReadOnlyFn("genie", "get-post", [standardPrincipalCV(wallet)], wallet);
    expect(postResult).toBeSome(Cl.stringUtf8("Hello, world!"));

    // Delete the post 
    const { result: deleteResult } = simnet.callPublicFn("genie", "delete-post", [standardPrincipalCV(wallet)], wallet);
    expect(deleteResult).toBeOk(Cl.stringAscii("Post deleted successfully"));

    // Check if post exists
    const { result: postResult2 } = simnet.callReadOnlyFn("genie", "get-post", [standardPrincipalCV(wallet)], wallet);
    expect(postResult2).toBeNone();
    
    
    
    
  });
});

  // it("shows an example", () => {
  //   const { result } = simnet.callReadOnlyFn("counter", "get-counter", [], address1);
  //   expect(result).toBeUint(0);
  // });
