### 2.11.2 Downgrade Paths

* Downgrade is only supported between General Availability (GA) releases.

* Downgrade from MySQL 5.7 to 5.6 is supported using the *logical downgrade* method.

* Downgrade that skips versions is not supported. For example, downgrading directly from MySQL 5.7 to 5.5 is not supported.

* Downgrade within a release series is supported. For example, downgrading from MySQL 5.7.*`z`* to 5.7.*`y`* is supported. Skipping a release is also supported. For example, downgrading from MySQL 5.7.*`z`* to 5.7.*`x`* is supported.
