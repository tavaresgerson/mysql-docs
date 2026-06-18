### 2.11.2 Caminhos de Downgrade

- A desativação é suportada apenas entre as versões de Disponibilidade Geral (GA).

- A desativação do MySQL 5.7 para 5.6 é suportada usando o método de *desativação lógica*.

- A desativação de versões ignoradas não é suportada. Por exemplo, a desativação direta de MySQL 5.7 para 5.5 não é suportada.

- A desativação dentro de uma série de lançamentos é suportada. Por exemplo, a desativação de MySQL 5.7.*`z`* para 5.7.*`y`* é suportada. O pular um lançamento também é suportado. Por exemplo, a desativação de MySQL 5.7.*`z`* para 5.7.*`x`* é suportada.
