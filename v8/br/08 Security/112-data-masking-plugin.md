### 8.5.3 Plugin de Máscara e Desidentificação de Dados do MySQL Enterprise

A Máscara e Desidentificação de Dados do MySQL Enterprise é baseada em uma biblioteca de plugins que implementa esses elementos:

* Um plugin do lado do servidor chamado `data_masking`.
* Um conjunto de funções carregáveis que fornece uma API de nível SQL para realizar operações de máscara e desidentificação. Algumas dessas funções requerem o privilégio `SUPER`.