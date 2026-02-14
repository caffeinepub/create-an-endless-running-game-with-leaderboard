import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  // Type alias for clarity
  type Score = Nat;

  // Module to handle the Map of principals to scores
  module LeaderboardMap {
    private func compareEntries(a : (Principal, Score), b : (Principal, Score)) : Order.Order {
      // Sort by score, descending
      switch (Nat.compare(b.1, a.1)) {
        case (#equal) {
          // If scores are equal, compare by principal to ensure deterministic ordering
          Principal.compare(a.0, b.0);
        };
        case (order) { order };
      };
    };

    public func toSortedArray(map : Map.Map<Principal, Score>) : [(Principal, Score)] {
      map.entries().toArray().sort(compareEntries);
    };
  };

  // Persistent Map to store scores for each principal
  let scores = Map.empty<Principal, Score>();

  // Update score for authenticated principal if it's their best
  public shared ({ caller }) func submitScore(newScore : Score) : async Score {
    if (newScore == 0) {
      return 0;
    };

    switch (scores.get(caller)) {
      case (?score) {
        if (newScore > score) {
          scores.add(caller, newScore);
          newScore;
        } else {
          score;
        };
      };
      case (null) {
        scores.add(caller, newScore);
        newScore;
      };
    };
  };

  // Query the best score of the authenticated principal
  public query ({ caller }) func getBestScore() : async Score {
    switch (scores.get(caller)) {
      case (?score) { score };
      case (null) { 0 };
    };
  };

  // Query the top N scores
  public query ({ caller }) func getLeaderboard(n : Nat) : async [(Principal, Score)] {
    let sortedScores = LeaderboardMap.toSortedArray(scores);
    let length = sortedScores.size();
    let takeN = if (n < length) { n } else { length };
    sortedScores.sliceToArray(0, takeN);
  };
};
