### 2.11.2 Caminhos de Downgrade

* O Downgrade é suportado apenas entre versões de Disponibilidade Geral (GA - General Availability).

* O Downgrade do MySQL 5.7 para 5.6 é suportado usando o método de *logical downgrade*.

* O Downgrade que pula versões não é suportado. Por exemplo, o downgrade direto do MySQL 5.7 para 5.5 não é suportado.

* O Downgrade dentro de uma série de lançamento é suportado. Por exemplo, o downgrade de MySQL 5.7.*`z`* para 5.7.*`y`* é suportado. Pular um lançamento também é suportado. Por exemplo, o downgrade de MySQL 5.7.*`z`* para 5.7.*`x`* é suportado.