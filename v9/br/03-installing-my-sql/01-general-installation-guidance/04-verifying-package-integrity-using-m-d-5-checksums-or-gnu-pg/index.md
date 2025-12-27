### 2.1.4 Verificar a integridade do pacote usando verificações MD5 ou GnuPG

2.1.4.1 Verificar o checksum MD5

2.1.4.2 Verificação de assinatura usando GnuPG

2.1.4.3 Verificação de assinatura usando Gpg4win para Windows

2.1.4.4 Verificação de assinatura usando RPM

2.1.4.5 Chave pública de construção GPG para pacotes arquivados

Depois de baixar o pacote MySQL que atende às suas necessidades e antes de tentar instalá-lo, certifique-se de que ele está intacto e não foi adulterado. Existem três meios de verificação de integridade:

* Verificações MD5
* Assinaturas criptográficas usando `GnuPG`, o GNU Privacy Guard

* Para pacotes RPM, o mecanismo de verificação de integridade integrado do RPM

As seções a seguir descrevem como usar esses métodos.

Se você notar que o checksum MD5 ou as assinaturas GPG não correspondem, tente primeiro baixar o pacote respectivo mais uma vez, talvez de outro site de espelho.