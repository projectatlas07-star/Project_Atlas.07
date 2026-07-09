"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const supabase_1 = require("../lib/supabase");
async function authMiddleware(request, reply) {
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        reply.code(401).send({ error: 'Missing auth token' });
        return;
    }
    const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
    if (error || !user) {
        reply.code(401).send({ error: 'Invalid token' });
        return;
    }
    // Attach user info to request for downstream handlers
    request.user = user;
    // Resolve companyId via tenant_members
    const { data: tm, error: tmErr } = await supabase_1.supabase
        .from('tenant_members')
        .select('company_id, role')
        .eq('user_id', user.id)
        .single();
    if (tmErr || !tm) {
        reply.code(403).send({ error: 'User not assigned to a company' });
        return;
    }
    request.companyId = tm.company_id;
    request.role = tm.role;
}
