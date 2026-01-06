### 6.3.4 Capacidades dependentes da biblioteca SSL

O MySQL pode ser compilado usando o OpenSSL ou o yaSSL, ambos os quais permitem conexões criptografadas com base na API OpenSSL:

- As distribuições binárias da Edição Empresarial do MySQL são compiladas com o OpenSSL. Não é possível usar o yaSSL com a Edição Empresarial do MySQL.

- As distribuições binárias da Edição Comunitária do MySQL são compiladas usando o yaSSL.

- As distribuições de código-fonte da MySQL Community Edition podem ser compiladas usando o OpenSSL ou o yaSSL (consulte Seção 2.8.6, “Configurando Suporte à Biblioteca SSL”).

Nota

É possível compilar o MySQL usando o yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

OpenSSL e yaSSL oferecem a mesma funcionalidade básica, mas as distribuições do MySQL compiladas com OpenSSL têm recursos adicionais:

- O OpenSSL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2. O yaSSL suporta apenas os protocolos TLSv1 e TLSv1.1.

- O OpenSSL suporta uma sintaxe mais flexível para especificar cifrares (para a variável de sistema `ssl_cipher` e a opção de cliente `--ssl-cipher`), e suporta uma gama mais ampla de cifrares de criptografia a partir dos quais escolher. Veja Opções de comando para conexões criptografadas e Seção 6.3.2, “Protocolos e cifrares TLS de conexão criptografada”.

- O OpenSSL suporta a variável de sistema `ssl_capath` e a opção de cliente `--ssl-capath`. As distribuições do MySQL compiladas com o yaSSL não o fazem porque o yaSSL não procura em nenhum diretório e não segue uma árvore de certificados encadeada. O yaSSL exige que todos os componentes da árvore de certificados CA estejam contidos em uma única árvore de certificados CA e que cada certificado no arquivo tenha um valor de SubjectName único. Para contornar essa limitação, concatene os arquivos de certificado individuais que compõem a árvore de certificados em um novo arquivo e especifique esse arquivo como o valor da variável de sistema `ssl_ca` e da opção `--ssl-ca`.

- O OpenSSL suporta a capacidade de lista de revogação de certificados (para as variáveis de sistema `ssl_crl` e `ssl_crlpath` e as opções de cliente `--ssl-crl` e `--ssl-crlpath`). As distribuições compiladas com o yaSSL não o fazem porque as listas de revogação não funcionam com o yaSSL. (O yaSSL aceita essas opções, mas ignora-as silenciosamente.)

- As contas que autenticam usando o plugin `sha256_password` podem usar arquivos de chave RSA para troca segura de senhas em conexões não criptografadas. Veja Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

- O servidor pode gerar automaticamente os arquivos de certificado e chave SSL e RSA ausentes durante o início. Veja Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

- O OpenSSL suporta mais modos de criptografia para as funções `AES_ENCRYPT()` e `AES_DECRYPT()`. Veja Seção 12.13, “Funções de Criptografia e Compressão”

Algumas variáveis de sistema e status relacionadas ao OpenSSL estão presentes apenas se o MySQL foi compilado com o OpenSSL:

- `auto_generate_certs`
- `sha256_password_auto_generate_rsa_keys`
- `sha256_password_private_key_path`
- `sha256_password_public_key_path`
- `Rsa_public_key`

Para determinar se um servidor foi compilado com o OpenSSL, teste a existência de alguma dessas variáveis. Por exemplo, esta declaração retorna uma linha se o OpenSSL foi usado e um resultado vazio se o yaSSL foi usado:

```sql
SHOW STATUS LIKE 'Rsa_public_key';
```
